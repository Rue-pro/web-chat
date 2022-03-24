import { rest } from 'msw'
import { API } from '../../../config/environment-variables'

export const handler = rest.post(`${API}/auth/login`, (req, res, ctx) => {
  return res(
    ctx.delay(2000),
    ctx.status(200),
    /*ctx.json({ error: 'Something went wrong' }),*/
    ctx.json(accessToken),
  )
})

const accessToken = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbDB3ZzMwYnMwMDA0aDh2b3h6cnVxcmh1IiwiaWF0IjoxNjQ4MTAzMDEzLCJleHAiOjE2NDgxMDY2MTN9.uACq0F4swXannHrKE5g1XEQ7xS_rxK_1izb4qsrMeGo',
}
