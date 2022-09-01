# react-query-auth

[![NPM](https://img.shields.io/npm/v/react-query-auth.svg)](https://www.npmjs.com/package/react-query-auth)

Authenticate your react applications easily with react-query.

## Introduction

Thanks to react-query we have been able to reduce our codebases by a lot by caching server state with it. However, we still have to think about where to store the authenticatables (typically a "user") data. The authenticatables data can be considered as a global application state because we need to access it from lots of places in the application. On the other hand, it is also a server state since all the authenticatable data is expected to arrive from a server. With this library, we can manage authentication in an easy way. It is agnostic of the method you are using for authenticating your application, it can be adjusted according to the API it is being used against. It just needs the configuration to be provided and the rest will be set up automatically.

## Table of Contents

- [Demo:](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [LICENSE](#license)

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
import { loginAuthenticatable, loginFn, registerFn, logoutFn } from '...';

interface Authenticatable {
  id: string;
  name: string;
}

interface Error {
  message: string;
}

const authConfig = {
  loadAuthenticatable,
  loginFn,
  registerFn,
  logoutFn,
};

export const { AuthProvider, useAuth } = initReactQueryAuth<
  Authenticatable,
  Error,
  LoginCredentials,
  RegisterCredentials
>(authConfig);
```

`AuthProvider` should be rendered inside the `QueryClientProvider` from `react-query`.

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

Then the authenticatables data is accessible from any component rendered inside the provider via the `useAuth` hook:

```ts
// src/components/UserInfo.tsx
import { useAuth } from 'src/lib/auth';

export const UserInfo = () => {
  // PROTIP: You can use destructuring to name your authenticatable to something that better serves your app
  const { authenticatable: user } = useAuth();
  return <div>My Name is {user.name}</div>;
};
```

## API

### `initReactQueryAuth`

Function that initializes and returns `AuthProvider`, `AuthConsumer` and `useAuth`.

```ts
// src/lib/auth.ts
export const { AuthProvider, useAuth } = initReactQueryAuth<
  Authenticatable,
  Error
>({
  key,
  loadAuthenticatable,
  loginFn,
  registerFn,
  logoutFn,
  waitInitial,
  LoaderComponent,
  ErrorComponent,
});
```

##### configuration

- `key: string`

  - key that is being used by react-query.
  - defaults to `'auth-authenticatable'`

- `loadAuthenticatable: (data:any) => Promise<Authenticatable>`

  - **Required**
  - function that handles authenticatable profile fetching

- `loginFn: (data:any) => Promise<Authenticatable>`

  - **Required**
  - function that handles authenticatable login

- `registerFn: (data:any) => Promise<Authenticatable>`

  - **Required**
  - function that handles authenticatable registration

- `logoutFn: (data:unknown) => Promise<any>`

  - **Required**
  - function that handles authenticatable logout

- `logoutFn: () => Promise<any>`

  - **Required**
  - function that handles authenticatable logout

- `waitInitial: boolean`

  - Flag for checking if the provider should show `LoaderComponent` while fetching the authenticatable. If set to `false` it will fetch the authenticatable in the background.
  - defaults to `true`

- `LoaderComponent: () => React.ReactNode`

  - component for the loader
  - defaults to `() => <div>Loading...</div>`

- `ErrorComponent: (error: Error) => React.ReactNode`

  - component for the error
  - defaults to `(error) => (<div style={{color: 'tomato'}}>{JSON.stringify(error, null, 2)}</div>)`

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

The hook allows access of the authenticatable data across the app.

```ts
import { useAuth } from 'src/lib/auth';

export const UserInfo = () => {
  const {
    authenticatable: user,
    login,
    logout,
    register,
    error,
    refetch,
  } = useAuth();
  return <div>My Name is {user.name}</div>;
};
```

##### returns context value:

- `authenticatable: Authenticatable | undefined`

  - authenticatables data that was retrieved from server
  - type can be provided by passing it to `initReactQueryAuth` generic

- `login: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>`

  - function to login the authenticatable

- `logout: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>`

  - function to logout the authenticatable

- `register: (variables: TVariables, { onSuccess, onSettled, onError }) => Promise<TData>`

  - function to register the authenticatable

- `isLoggingIn: boolean`

  - checks if is logging in is in progress

- `isLoggingOut: boolean`

  - checks if is logging out is in progress

- `isRegistering: boolean`

  - checks if is registering in is in progress

- `refetchAuthenticatable: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<Authenticatable, Error>>`

  - function for refetching authenticatables data. this can also be done by invalidating its query by `key`

- `error: Error | null`
  - error object
  - type can be provided by passing it to `initReactQueryAuth`

### `AuthConsumer`

Exposes the same context value like the `useAuth` hook but as render prop.

```ts
import { AuthProvider, AuthConsumer } from './lib/auth';
import { ReactQueryProvider } from './lib/react-query';

export const App = () => {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <AuthConsumer>
          {({ authenticatable }) => (
            <div>
              {JSON.stringify(authenticatable) || 'No Authenticatable Found'}
            </div>
          )}
        </AuthConsumer>
      </AuthProvider>
    </ReactQueryProvider>
  );
};
```

## Contributing

1. Clone this repo
2. Create a branch: `git checkout -b your-feature`
3. Make some changes
4. Test your changes
5. Push your branch and open a Pull Request

## LICENSE

MIT
