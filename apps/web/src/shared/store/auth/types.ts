import { InstanceOf, Record, String } from 'runtypes'
import { UserId } from 'shared/config'

export const RawLoggedDataSchema = Record({
  accessToken: Record({
    expiresIn: InstanceOf(Date),
  }),
  refreshToken: Record({
    expiresIn: InstanceOf(Date),
  }),
  user: Record({
    userId: String,
  }),
})

export interface User {
  userId: UserId
}

export interface LoginData {
  email: string
  password: string
}
