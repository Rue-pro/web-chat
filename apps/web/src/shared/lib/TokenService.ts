import axios from 'axios'
import { Record, String, InstanceOf } from 'runtypes'

import { API_URL, ClientError } from 'shared/config'
import { BrowserStorageService } from 'shared/lib'

const APIInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
})

const KEY = 'tokens'

interface TokensExpiration {
  accessTokenExpiration: Date | null
  refreshTokenExpiration: Date | null
}
interface TokensPayload extends TokensExpiration {
  user: {
    id: string
  }
}

const defaultTokensExpiration: TokensExpiration = {
  accessTokenExpiration: null,
  refreshTokenExpiration: null,
}

const RawTokensPayloadSchema = Record({
  accessToken: Record({
    expiresIn: InstanceOf(Date),
  }),
  refreshToken: Record({
    expiresIn: InstanceOf(Date),
  }),
  user: Record({
    id: String,
  }),
})

export enum RefreshTokensResultError {
  REFRESH_TOKEN_EXPIRED,
  ACCESS_AND_REFRESH_TOKENS_ARE_NOT_EXPIRED,
  FETCHED_FORMAT_IS_WRONG,
}

class TokenService {
  private isAccessTokenExpired(): boolean {
    const { accessTokenExpiration } =
      BrowserStorageService.loadState<TokensExpiration>(
        KEY,
        defaultTokensExpiration,
      )
    if (!accessTokenExpiration) {
      return true
    }
    const currentTime = new Date()
    return currentTime >= new Date(accessTokenExpiration)
  }

  private isRefreshTokenExpired(): boolean {
    const { refreshTokenExpiration } =
      BrowserStorageService.loadState<TokensExpiration>(
        KEY,
        defaultTokensExpiration,
      )
    if (!refreshTokenExpiration) {
      return true
    }
    const currentTime = new Date()
    return currentTime >= new Date(refreshTokenExpiration)
  }

  async refreshTokens(): Promise<TokensPayload> {
    if (this.isRefreshTokenExpired()) {
      throw RefreshTokensResultError.REFRESH_TOKEN_EXPIRED
    }
    if (this.isAccessTokenExpired()) {
      try {
        const response = await APIInstance({ url: `${API_URL}/auth/refresh` })

        const data = response.data
        if (response.status !== 200) {
          throw Error(data.message.content)
        }

        const isRawTokensPayload = RawTokensPayloadSchema.guard(data)
        if (!isRawTokensPayload) {
          const error: ClientError = {
            type: 'ERROR_BACKEND_REQUEST_VALIDATION',
            date: new Date(),
            message:
              '[Refresh tokens] Fetched token result format is wrong' +
              JSON.stringify(data, null, 2),
            details:
              'Expected object: ' +
              JSON.stringify({
                accessToken: {
                  expiresIn: 'String',
                },
                refreshToken: {
                  expiresIn: 'String',
                },
                user: {
                  id: 'String',
                },
              }),
          }

          console.error(error)
          throw RefreshTokensResultError.FETCHED_FORMAT_IS_WRONG
        }

        this.setTokensExpirationTime(
          data.accessToken.expiresIn,
          data.refreshToken.expiresIn,
        )
        return {
          accessTokenExpiration: data.accessToken.expiresIn,
          refreshTokenExpiration: data.refreshToken.expiresIn,
          user: data.user,
        }
      } catch (e) {}
    }
    throw RefreshTokensResultError.ACCESS_AND_REFRESH_TOKENS_ARE_NOT_EXPIRED
  }

  removeTokensExpirationTime() {
    BrowserStorageService.removeState(KEY)
  }

  setTokensExpirationTime(
    accessTokenExpiration: Date,
    refreshTokenExpiration: Date,
  ) {
    BrowserStorageService.saveState(KEY, {
      accessTokenExpiration: accessTokenExpiration,
      refreshTokenExpiration: refreshTokenExpiration,
    })
  }

  isTokensValid(): boolean {
    if (this.isAccessTokenExpired() || this.isRefreshTokenExpired()) {
      return false
    }
    return true
  }
}

export default new TokenService()
