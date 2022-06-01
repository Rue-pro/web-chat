import axios from 'axios'

import { API_URL, UserId } from 'shared/config'
import { loadState, removeState, saveState } from 'shared/lib'

const APIInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
})

const KEY = 'tokens'

interface TokensData {
  accessTokenExpiration: Date
  refreshTokenExpiration: Date
}

const defaultData: TokensData = {
  accessTokenExpiration: new Date(),
  refreshTokenExpiration: new Date(),
}

class TokenService {
  private isAccessTokenExpired(): boolean {
    const { accessTokenExpiration } = loadState<TokensData>(KEY, defaultData)
    const currentTime = new Date()
    console.groupCollapsed('[TOKEN_SERVICE] isAccessTokenExpired')
    console.log('Current time:', currentTime)
    console.log('accessTokenExpiration:', new Date(accessTokenExpiration))
    console.log(
      'If current time more then accessTokenExpiration: ',
      currentTime >= new Date(accessTokenExpiration),
    )
    console.groupEnd()
    return currentTime >= new Date(accessTokenExpiration)
  }

  private isRefreshTokenExpired(): boolean {
    const { refreshTokenExpiration } = loadState<TokensData>(KEY, defaultData)
    const currentTime = new Date()
    console.groupCollapsed('[TOKEN_SERVICE] isRefreshTokenExpired')
    console.log('Current time:', currentTime)
    console.log('refreshTokenExpiration:', new Date(refreshTokenExpiration))
    console.log(
      'If current time more then refreshTokenExpiration: ',
      currentTime >= new Date(refreshTokenExpiration),
    )
    console.groupEnd()
    return currentTime >= new Date(refreshTokenExpiration)
  }

  async refreshTokens(onRefresh?: (userId: UserId) => void) {
    console.groupCollapsed('[TOKEN_SERVICE] refreshTokens')
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
        if (onRefresh) onRefresh(data.user.id)
      } catch (e) {
        console.error('ERROR', e)
      }
    }
    console.groupEnd()
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
    console.groupCollapsed('[TOKEN_SERVICE] isTokensValid')
    if (this.isAccessTokenExpired() || this.isRefreshTokenExpired()) {
      console.log('RETURN FALSE')
      console.groupEnd()
      return false
    }
    console.log('RETURN TRUE')
    console.groupEnd()
    return true
  }
}

export default new TokenService()
