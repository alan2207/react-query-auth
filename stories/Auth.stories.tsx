import React from 'react';
import { Meta, Story } from '@storybook/react';
import { rest } from 'msw';
import SampleApp from '../sample-app';
import { User } from '../sample-app/api';
import { getUser, setUser } from '../sample-app/db';

const meta: Meta = {
  title: 'SampleApp',
  component: SampleApp,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <SampleApp />;

export const Default = Template.bind({});
Default.story = {
  parameters: {
    msw: [
      rest.get('/auth/me', (req, res, ctx) => {
        const user = getUser(req.headers.get('Authorization'));

        if (user) {
          return res(ctx.json(user));
        }

        return res(
          ctx.status(401, 'Unauthorized'),
          ctx.json({ message: 'Unauthorized' })
        );
      }),
      rest.post('/auth/login', (req, res, ctx) => {
        const parsedBody = JSON.parse(req.body as string) as User;
        const user = getUser(parsedBody.email);
        if (user) {
          return res(
            ctx.json({
              jwt: user.email,
              user,
            })
          );
        } else {
          return res(
            ctx.status(400, 'Error'),
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
              ctx.json({
                jwt: newUser.email,
                user: getUser(newUser.email),
              })
            );
          }
          return res(
            ctx.status(400, 'Error'),
            ctx.json({ message: 'Forbidden User' })
          );
        } else {
          return res(
            ctx.status(400, 'Error'),
            ctx.json({ message: 'The user already exists!' })
          );
        }
      }),
    ],
  },
};
