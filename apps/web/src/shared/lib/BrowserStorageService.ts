class BrowserStorageService {
  public loadState<T>(KEY: string, defaultState: T): T {
    try {
      const serializedState = localStorage.getItem(KEY)
      if (!serializedState) return defaultState
      return JSON.parse(serializedState)
    } catch (e) {
      console.log('LOAD STATE ERROR', e)
      return defaultState
    }
  }

  public saveState<T>(KEY: string, state: T) {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(KEY, serializedState)
  }

  public removeState(KEY: string) {
    localStorage.removeItem(KEY)
  }
}

export default new BrowserStorageService()
