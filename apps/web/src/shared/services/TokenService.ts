import axios from 'axios'

import { API_URL, UserId } from 'shared/config'
import { loadState, removeState, saveState } from 'shared/lib'
import store from 'shared/store'
import { authActions } from 'shared/store/authSlice'

const APIInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
})

const KEY = 'tokens'

interface TokensData {
  accessTokenExpiration: Date | null
  refreshTokenExpiration: Date | null
}

const defaultData: TokensData = {
  accessTokenExpiration: null,
  refreshTokenExpiration: null,
}

class TokenService {
  private isAccessTokenExpired(): boolean {
    const { accessTokenExpiration } = loadState<TokensData>(KEY, defaultData)
    if (!accessTokenExpiration) {
      console.log('[TOKEN_SERVICE] accessTokenExpiration NotExist')
      return true
    }
    const currentTime = new Date()
    console.log('[TOKEN_SERVICE] isAccessTokenExpired')
    console.log('Current time:', currentTime)
    console.log('accessTokenExpiration:', new Date(accessTokenExpiration))
    console.log(
      'If current time more then accessTokenExpiration: ',
      currentTime >= new Date(accessTokenExpiration),
    )
    console.log()

    return currentTime >= new Date(accessTokenExpiration)
  }

  private isRefreshTokenExpired(): boolean {
    const { refreshTokenExpiration } = loadState<TokensData>(KEY, defaultData)
    if (!refreshTokenExpiration) {
      console.log('[TOKEN_SERVICE] refreshToken NotExist')
      return true
    }
    const currentTime = new Date()
    console.log('[TOKEN_SERVICE] isRefreshTokenExpired')
    console.log('Current time:', currentTime)
    console.log('refreshTokenExpiration:', new Date(refreshTokenExpiration))
    console.log(
      'If current time more then refreshTokenExpiration: ',
      currentTime >= new Date(refreshTokenExpiration),
    )
    console.log()
    return currentTime >= new Date(refreshTokenExpiration)
  }

  async refreshTokens() {
    console.log('[TOKEN_SERVICE] refreshTokens')
    if (this.isRefreshTokenExpired()) {
      return 'ERROR_REFRESH_TOKEN_EXPIRED'
    }
    if (this.isAccessTokenExpired()) {
      console.log('Access token expired')
      try {
        const response = await APIInstance({ url: `${API_URL}/auth/refresh` })

        const data = response.data
        if (response.status !== 200) {
          throw Error(data.message.content)
        }

        this.setTokensExpirationTime(
          data.accessToken.expiresIn,
          data.refreshToken.expiresIn,
        )
        console.log('TOKEN_REFRESHED', data)
        return data
      } catch (e) {
        console.error('ERROR', e)
      }
    }
  }

  removeTokensExpirationTime() {
    console.log('removeTokensExpirationTime')
    removeState(KEY)
  }

  setTokensExpirationTime(
    accessTokenExpiration: Date,
    refreshTokenExpiration: Date,
  ) {
    saveState(KEY, {
      accessTokenExpiration: accessTokenExpiration,
      refreshTokenExpiration: refreshTokenExpiration,
    })
  }

  isTokensValid(): boolean {
    console.log('[TOKEN_SERVICE] isTokensValid')
    if (this.isAccessTokenExpired() || this.isRefreshTokenExpired()) {
      console.log('RETURN FALSE')
      return false
    }
    console.log('RETURN TRUE')
    return true
  }
}

export default new TokenService()
