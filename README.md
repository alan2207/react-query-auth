# react-query-auth

[![NPM](https://img.shields.io/npm/v/react-query-auth.svg)](https://www.npmjs.com/package/react-query-auth)

Authenticate your react applications easily with [React Query](https://tanstack.com/query/v4/docs/react).

## Introduction

Using React Query has allowed us to significantly reduce the size of our codebase by caching server state. However, we still need to consider where to store user data, which is a type of global application state that we need to access from many parts of the app, but is also a server state since it is obtained from a server. This library makes it easy to manage user authentication, and can be adapted to work with any API or authentication method.

## Installation

```
$ npm install @tanstack/react-query react-query-auth
```

Or if you use Yarn:

```
$ yarn add @tanstack/react-query react-query-auth
```

## Usage

To use this library, you will need to provide it with functions for fetching the current user, logging in, registering, and logging out. You can do this using the `configureAuth` function:

```ts
import { configureAuth } from 'react-query-auth';

const { useUser, useLogin, useRegister, useLogout } = configureAuth({
  userFn: () => api.get('/me'),
  loginFn: (credentials) => api.post('/login', credentials),
  registerFn: (credentials) => api.post('/register', credentials),
  logoutFn: () => api.post('/logout'),
});
```

With these hooks, you can then add authentication functionality to your app. For example, you could use the `useUser` hook to access the authenticated user in a component.

You can also use the `useLogin`, `useRegister`, and `useLogout` hooks to allow users to authenticate and log out.

```tsx
function UserInfo() {
  const user = useUser();
  const logout = useLogout();

  if (user.isLoading) {
    return <div>Loading ...</div>;
  }

  if (user.error) {
    return <div>{JSON.stringify(user.error, null, 2)}</div>;
  }

  if (!user.data) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <div>Logged in as {user.data.email}</div>
      <button disabled={logout.isLoading} onClick={logout.mutate({})}>
        Log out
      </button>
    </div>
  );
}
```

The library also provides the `AuthLoader` component that can be used to handle loading states when fetching the authenticated user. You can use it like this:

```tsx
function MyApp() {
  return (
    <AuthLoader
      renderLoading={() => <div>Loading ...</div>}
      renderUnauthenticated={() => <AuthScreen />}
    >
      <UserInfo />
    </AuthLoader>
  );
}
```

**NOTE: All hooks and components must be used within `QueryClientProvider`.**

## API Reference:

### `configureAuth`:

The `configureAuth` function takes in a configuration object and returns a set of custom hooks for handling authentication.

#### The `configureAuth` configuration object:

A configuration object that specifies the functions and keys to be used for various authentication actions. It accepts the following properties:

- **`userFn`:**
  A function that is used to retrieve the authenticated user. It should return a Promise that resolves to the user object, or null if the user is not authenticated.

- **`loginFn`:**
  A function that is used to log the user in. It should accept login credentials as its argument and return a Promise that resolves to the user object.

- **`registerFn`:**
  A function that is used to register a new user. It should accept registration credentials as its argument and return a Promise that resolves to the new user object.

- **`logoutFn`:**
  A function that is used to log the user out. It should return a Promise that resolves when the logout action is complete.

- **`userKey`:**
  An optional key that is used to store the authenticated user in the react-query cache. The default value is `['authenticated-user']`.

#### The `configureAuth` returned object:

`configureAuth` returns an object with the following properties:

- **`useUser`:**
  A custom hook that retrieves the authenticated user. It is a wrapper around [useQuery](https://tanstack.com/query/v4/docs/react/reference/useQuery) that uses the `userFn` and `userKey` specified in the `configAuth` configuration. The hook accepts the same options as [useQuery](https://tanstack.com/query/v4/docs/react/reference/useQuery), except for `queryKey` and `queryFn`, which are predefined by the configuration.

- **`useLogin`:**
  A custom hook that logs the user in. It is a wrapper around [useMutation](https://tanstack.com/query/v4/docs/react/reference/useMutation) that uses the `loginFn` specified in the configuration. The hook accepts the same options as [useMutation](https://tanstack.com/query/v4/docs/react/reference/useMutation), except for `mutationFn`, which is set by the configuration. On success, the hook updates the authenticated user in the React Query cache using the `userKey` specified in the configuration.

- **`useRegister`:**
  A custom hook that registers a new user. It is a wrapper around [useMutation](https://tanstack.com/query/v4/docs/react/reference/useMutation) that uses the `registerFn` specified in the configuration. The hook accepts the same options as [useMutation](https://tanstack.com/query/v4/docs/react/reference/useMutation), except for `mutationFn`, which is set by the configuration. On success, the hook updates the authenticated user in the React Query cache using the `userKey` specified in the configuration.

- **`useLogout`:**
  A custom hook that logs the user out. It is a wrapper around [useMutation](https://tanstack.com/query/v4/docs/react/reference/useMutation) that uses the `logoutFn` specified in the configuration. The hook accepts the same options as [useMutation](https://tanstack.com/query/v4/docs/react/reference/useMutation), except for `mutationFn`, which is set by the configuration. On success, the hook removes the authenticated user from the React Query cache using the `userKey` specified in the configuration.

- **`AuthLoader`:**

  A component that can be used to handle loading states when fetching the authenticated user. It accepts the following props:

  - **`renderLoading`**:
    A function that is called when the authenticated user is being fetched. It should return a React node that is rendered while the user is being fetched.

  - **`renderUnauthenticated`**:
    A function that is called when the authenticated user is not authenticated. It should return a React node that is rendered when the user is not authenticated.

  - **`renderError`**:
    A function that is called when an error is thrown during the authentication request. Its receives the `Error` object thrown.
    Defaults to `(error: Error) => <div>{JSON.stringify(error)}</div>`

  - **`children`**:
    A React node that is rendered when the authenticated user is successfully fetched.

## Examples:

To try out the library, check out the `examples` folder.

## Contributing

1. Clone this repo
2. Create a branch: `git checkout -b your-feature`
3. Make some changes
4. Test your changes
5. Push your branch and open a Pull Request

## LICENSE

MIT
