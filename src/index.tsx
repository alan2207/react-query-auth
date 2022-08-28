import React from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';

export interface AuthProviderConfig<
  User,
  Error,
  LoginCredentials,
  RegisterCredentials
> {
  key?: QueryKey;
  loadUser: QueryFunction<User, QueryKey>;
  userQueryOptions?: Omit<
    UseQueryOptions<User, Error, User, QueryKey>,
    'queryFn' | 'queryKey'
  >;
  loginFn: (data: LoginCredentials) => Promise<User>;
  registerFn: (data: RegisterCredentials) => Promise<User>;
  logoutFn: () => any;
}

export interface AuthContextValue<
  User,
  Error,
  LoginCredentials,
  RegisterCredentials
> {
  user: UseQueryResult<User, Error>;
  login: UseMutationResult<User, any, LoginCredentials>;
  logout: UseMutationResult<any, any, void, any>;
  register: UseMutationResult<User, any, RegisterCredentials>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function initReactQueryAuth<
  User,
  Error,
  LoginCredentials,
  RegisterCredentials
>(
  config: AuthProviderConfig<User, Error, LoginCredentials, RegisterCredentials>
) {
  const AuthContext =
    React.createContext<AuthContextValue<
      User,
      Error,
      LoginCredentials,
      RegisterCredentials
    > | null>(null);
  AuthContext.displayName = 'AuthContext';

  const {
    loadUser,
    userQueryOptions,
    loginFn,
    registerFn,
    logoutFn,
    key = ['auth-user'],
  } = config;

  function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const queryClient = useQueryClient();

    const user = useQuery<User, Error>(key, loadUser, userQueryOptions);

    const setUser = React.useCallback(
      (data: User) => queryClient.setQueryData(key, data),
      [queryClient]
    );

    const login = useMutation({
      mutationFn: loginFn,
      onSuccess: (user) => {
        setUser(user);
      },
    });

    const register = useMutation({
      mutationFn: registerFn,
      onSuccess: (user) => {
        setUser(user);
      },
    });

    const logout = useMutation({
      mutationFn: logoutFn,
      onSuccess: () => {
        queryClient.clear();
      },
    });

    const value = React.useMemo(
      () => ({
        user,
        login,
        logout,
        register,
      }),
      [user, login, logout, register]
    );

    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
      throw new Error(`useAuth must be used within an AuthProvider`);
    }
    return context;
  }

  function AuthLoader({
    children,
    renderLoading,
    renderError,
    renderFallback,
  }: {
    renderLoading: () => JSX.Element;
    renderError: ({ error }: { error: Error }) => JSX.Element;
    renderFallback: () => JSX.Element;
    children: React.ReactNode;
  }) {
    const {
      user: { isSuccess, isLoading, fetchStatus, error, status, data },
    } = useAuth();

    if (error) {
      return renderError({ error });
    }

    if (isSuccess) {
      if (!data) {
        return renderFallback();
      }
      return <>{children}</>;
    }

    if (isLoading || fetchStatus === 'idle') {
      return renderLoading();
    }

    return <div>Unhandled status: {status}</div>;
  }

  return {
    AuthProvider,
    AuthConsumer: AuthContext.Consumer,
    AuthLoader,
    useAuth,
  };
}
