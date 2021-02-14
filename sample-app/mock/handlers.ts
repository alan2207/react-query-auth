import { rest } from 'msw';
import { User } from '../api';
import { getUser, setUser } from './db';

export const handlers = [
  rest.get('/auth/me', (req, res, ctx) => {
    const user = getUser(req.headers.get('Authorization'));

    if (user) {
      return res(ctx.delay(1000), ctx.json(user));
    }

    return res(
      ctx.delay(1000),
      ctx.status(401),
      ctx.json({ message: 'Unauthorized' })
    );
  }),
  rest.post('/auth/login', (req, res, ctx) => {
    const parsedBody = JSON.parse(req.body as string) as User;
    const user = getUser(parsedBody.email);
    if (user) {
      return res(
        ctx.delay(1000),
        ctx.json({
          jwt: user.email,
          user,
        })
      );
    } else {
      return res(
        ctx.delay(1000),
        ctx.status(401),
        ctx.json({ message: 'Unauthorized' })
      );
    }
  }),
  rest.post('/auth/register', (req, res, ctx) => {
    const parsedBody = JSON.parse(req.body as string) as User;
    const user = getUser(parsedBody?.email);
    if (!user && parsedBody) {
      const newUser = setUser(parsedBody);
      if (newUser) {
        return res(
          ctx.delay(1000),
          ctx.json({
            jwt: newUser.email,
            user: getUser(newUser.email),
          })
        );
      }
      return res(
        ctx.delay(1000),
        ctx.status(403),
        ctx.json({ message: 'Forbidden User' })
      );
    } else {
      return res(
        ctx.delay(1000),
        ctx.status(400),
        ctx.json({ message: 'The user already exists!' })
      );
    }
  }),
];
