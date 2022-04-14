export const loadState = <T>(KEY: string, defaultState: T): T => {
  try {
    const serializedState = localStorage.getItem(KEY)
    if (!serializedState) return defaultState
    return JSON.parse(serializedState)
  } catch (e) {
    return defaultState
  }
}

export const saveState = <T>(KEY: string, state: T) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(KEY, serializedState)
  } catch (e) {}
}

export const removeState = (KEY: string) => {
  try {
    localStorage.removeItem(KEY)
  } catch (e) {}
}
