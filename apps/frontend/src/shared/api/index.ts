import { MARVEL_API } from '../environment-variables'
import { Character } from '../types'

export type TGetCharacters = {
  characters: Character[]
  total: number
}

export function getCharacters(): Promise<TGetCharacters> {
  return fetch(`${MARVEL_API}/characters`)
    .then(res => res.json())
    .then(json => json)
    .catch(error => {
      console.error('getCharacters', error)
      return error
    })
}
