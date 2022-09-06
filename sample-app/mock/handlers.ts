import { rest } from 'msw';
import { Authenticatable } from '../api';
import { getAuthenticatable, setAuthenticatable } from './db';

export const handlers = [
  rest.get('/auth/me', (req, res, ctx) => {
    const authenticatable = getAuthenticatable(
      req.headers.get('Authorization')
    );

    if (authenticatable) {
      return res(ctx.delay(1000), ctx.json(authenticatable));
    }

    return res(
      ctx.delay(1000),
      ctx.status(401),
      ctx.json({ message: 'Unauthorized' })
    );
  }),
  rest.post('/auth/login', (req, res, ctx) => {
    const parsedBody = JSON.parse(req.body as string) as Authenticatable;
    const authenticatable = getAuthenticatable(parsedBody.email);
    if (authenticatable) {
      return res(
        ctx.delay(1000),
        ctx.json({
          jwt: authenticatable.email,
          authenticatable,
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
    const parsedBody = JSON.parse(req.body as string) as Authenticatable;
    const authenticatable = getAuthenticatable(parsedBody?.email);
    if (!authenticatable && parsedBody) {
      const newAuthenticatable = setAuthenticatable(parsedBody);
      if (newAuthenticatable) {
        return res(
          ctx.delay(1000),
          ctx.json({
            jwt: newAuthenticatable.email,
            authenticatable: getAuthenticatable(newAuthenticatable.email),
          })
        );
      }
      return res(
        ctx.delay(1000),
        ctx.status(403),
        ctx.json({ message: 'Forbidden Authenticatable' })
      );
    } else {
      return res(
        ctx.delay(1000),
        ctx.status(400),
        ctx.json({ message: 'The authenticatable already exists!' })
      );
    }
  }),
];
