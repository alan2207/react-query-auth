import { http, HttpResponse, delay } from 'msw'
import { setupWorker } from 'msw/browser'
import { storage } from '@/lib/utils'
import { DBUser, getUser, setUser } from './db'

const handlers = [
  http.get('/auth/me', async ({ request }) => {
    const user = getUser(request.headers.get('Authorization'))

    await delay(1000);

    return HttpResponse.json({ user })
  }),

  http.post('/auth/login', async ({ request }) => {
    const parsedBody = (await request.json()) as DBUser
    const user = getUser(parsedBody.email)

    await delay(1000);

    if (user && user.password === parsedBody.password) {
      return HttpResponse.json({
        jwt: user.email,
        user,
      })
    }

    return HttpResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    )
  }),

  http.post('/auth/register', async ({ request }) => {
    const parsedBody = (await request.json()) as DBUser
    const user = getUser(parsedBody?.email)

    await delay(1000);

    if (!user && parsedBody) {
      const newUser = setUser(parsedBody)
      if (newUser) {
        return HttpResponse.json({
          jwt: newUser.email,
          user: getUser(newUser.email),
        })
      }

      return HttpResponse.json(
        { message: 'Registration failed!' },
        { status: 403 }
      )
    }

    return HttpResponse.json(
      { message: 'The user already exists!' },
      { status: 400 }
    )
  }),

  http.post('/auth/logout', async () => {
    storage.clearToken()

    await delay(1000);

    return HttpResponse.json({ message: 'Logged out' })
  }),
]

export const worker = setupWorker(...handlers)
