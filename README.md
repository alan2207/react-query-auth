<h1 align="center">
  react-query-auth
  <br>
  
</h1>

[![NPM](https://img.shields.io/npm/v/react-query-auth.svg)](https://www.npmjs.com/package/react-query-auth)

<p align="center">Authenticate your react applications easily with react-query.</p>

## The Problem

Thanks to react-query we have been able to reduce our codebases by a lot by caching server state with it. However, we still have to think about where to store the user data. The user data can be considered as a global application state because we need to access it from lots of places in the application. On the other hand, it is also a server state since all the user data is expected to arrive from a server. This is the reason why we often unnecessarily reach out for a global state library such as redux, mobx, etc. These libraries are great and have their purpose, but they are redundant for just storing the user data.

## The solution

This solution is inspired by how the authentication has been done in the [bookshelf](https://github.com/kentcdodds/bookshelf) app made by Kent C. Dodds. The principles are very similar, with one difference. Since we are already using react-query for most of our applications, we can utilize its caching system to cache the user data as well. This way, we can invalidate and refetch the user data whenever we need that without complicating the codebase.

## Table of Contents

- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Demo:

[CodeSandbox](https://codesandbox.io/s/react-query-auth-demo-fvvvt)

It is also possible to try out the sample app locally via storybook by running following command:

```
$ npm run storybook
```

## Prerequisites

It is required to have `react-query` library installed and configured.

## Installation

```
$ npm install react-query-auth
```

Or if you use Yarn:

```
$ yarn add react-query-auth
```

## Usage

First of all, `AuthProvider` and `useAuth` must be initialized and exported.

```ts
// src/lib/auth.ts

import { initReactQueryAuth } from 'react-query-auth';
import { loginUser, loginFn, registerFn, logoutFn } from '...';

interface User {
  id: string;
  name: string;
}

interface Error {
  message: string;
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
};

export const { AuthProvider, useAuth } = initReactQueryAuth<User, Error>(
  authConfig
);
```

`AuthProvider` should be rendered inside the provider from `react-query`.

```ts
// src/App.tsx

import { QueryClient } from 'react-query';
import { QueryClientProvider } from 'react-query/devtools';
import { AuthProvider } from 'src/lib/auth';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {//the rest the app goes here}
      </AuthProvider>
    </QueryClientProvider>
  );
};
```

Then the user data is accessible from any component rendered inside the provider via the `useAuth` hook:

```ts
// src/components/UserInfo.tsx
import { useAuth } from 'src/lib/auth';

export const UserInfo = () => {
  const { user } = useAuth();
  return <div>My Name is {user.name}</div>;
};
```

## API

### `initReactQueryAuth`

Function that creates `AuthProvider` and `useAuth`.

```ts
// src/lib/auth.ts
export const { AuthProvider, useAuth } = initReactQueryAuth<User, Error>({
  key,
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  renderLoader,
  renderError,
  onLoginSuccess,
  onRegisterSuccess,
  onLogoutSuccess,
  onLoginError,
  onRegisterError,
  onLogoutError,
});
```

##### configuration

- `key: string`

  - key that is being used by react-query.
  - defaults to `'auth-user'`

- `loadUser: (data:unknown) => Promise<User>`

  - **Required**
  - function that handles user profile fetching

- `loginFn: (data:unknown) => Promise<User>`

  - **Required**
  - function that handles user login

- `registerFn: (data:unknown) => Promise<User>`

  - **Required**
  - function that handles user registration

- `logoutFn: (data:unknown) => Promise<any>`

  - **Required**
  - function that handles user logout

- `logoutFn: (data:unknown) => Promise<any>`

  - **Required**
  - function that handles user logout

- `renderLoader: () => React.ReactNode`

  - function that returns ui for the loader
  - defaults to `() => <div>Loading...</div>`

- `renderError: (error: Error) => React.ReactNode`

  - function that returns ui for the error
  - defaults to `(error) => (<div style={{color: 'tomato'}}>{JSON.stringify(error, null, 2)}</div>)`

- `onLoginSuccess: (user: User) => void || Promise<void>`

  - function triggered after successful login
  - defaults to `() => {}`

- `onRegisterSuccess: (user: User) => void || Promise<void>`

  - function triggered after successful registration
  - defaults to `() => {}`

- `onLogoutSuccess: (user: User) => void || Promise<void>`

  - function triggered after successful logout
  - defaults to `() => {}`

- `onLoginError: (error: Error) => void`

  - function triggered on login error
  - defaults to `() => {}`

* `onRegisterError: (error: Error) => void`

  - function triggered on registration error
  - defaults to `() => {}`

- `onLogoutError: (error: Error) => void`

  - function triggered on logout error
  - defaults to `() => {}`

#### `AuthProvider`

The provider wraps the app and allows `useAuth` hook data to be available across the app. No further configuration required.

```ts
import { AuthProvider } from 'src/lib/auth';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {//the rest of the app}
      </AuthProvider>
    </QueryClientProvider>
  );
};
```

#### `useAuth`

The hook allows access of the user data across the app.

```ts
import { useAuth } from 'src/lib/auth';

export const UserInfo = () => {
  const { user, login, logout, register, error, refetch } = useAuth();
  return <div>My Name is {user.name}</div>;
};
```

##### returns

- `user: User | undefined`

  - user data that was retrieved from server
  - type can be provided by passing it to `initReactQueryAuth`

- `login: (data: any) => Promise<User>`

  - function to login the user

- `logout: (data: any) => Promise<boolean>`

  - function to logout the user

- `register: (data: any) => Promise<User>`

  - function to register the user

- `refetch: (options: {throwOnError: boolean; cancelRefetch: boolean;}) => Promise<UseQueryResult>`

  - function for refetching the user data. this can also be done by invalidate it's query by the key

- `error: Error | null`
  - error object
  - type can be provided by passing it to `initReactQueryAuth`

## Contributing

1. Clone this repo
2. Create a branch: `git checkout -b your-feature`
3. Make some changes
4. Test your changes
5. Push your branch and open a Pull Request

## LICENSE

MIT
