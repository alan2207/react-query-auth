import React from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutateAsyncFunction,
  QueryObserverResult,
  RefetchOptions,
} from 'react-query';

export interface AuthProviderConfig<
  Authenticatable = unknown,
  Error = unknown
> {
  key?: string;
  loadAuthenticatable: (data: any) => Promise<Authenticatable>;
  loginFn: (data: any) => Promise<Authenticatable>;
  registerFn: (data: any) => Promise<Authenticatable>;
  logoutFn: () => Promise<any>;
  waitInitial?: boolean;
  LoaderComponent?: () => JSX.Element;
  ErrorComponent?: ({ error }: { error: Error | null }) => JSX.Element;
}

export interface AuthContextValue<
  Authenticatable = unknown,
  Error = unknown,
  LoginCredentials = unknown,
  RegisterCredentials = unknown
> {
  authenticatable: Authenticatable | undefined;
  login: UseMutateAsyncFunction<Authenticatable, any, LoginCredentials>;
  logout: UseMutateAsyncFunction<any, any, void, any>;
  register: UseMutateAsyncFunction<Authenticatable, any, RegisterCredentials>;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRegistering: boolean;
  refetchAuthenticatable: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Authenticatable, Error>>;
  error: Error | null;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function initReactQueryAuth<
  Authenticatable = unknown,
  Error = unknown,
  LoginCredentials = unknown,
  RegisterCredentials = unknown
>(config: AuthProviderConfig<Authenticatable, Error>) {
  const AuthContext = React.createContext<AuthContextValue<
    Authenticatable,
    Error,
    LoginCredentials,
    RegisterCredentials
  > | null>(null);
  AuthContext.displayName = 'AuthContext';

  const {
    loadAuthenticatable,
    loginFn,
    registerFn,
    logoutFn,
    key = 'auth-authenticatable',
    waitInitial = true,
    LoaderComponent = () => <div>Loading...</div>,
    ErrorComponent = (error: any) => (
      <div style={{ color: 'tomato' }}>{JSON.stringify(error, null, 2)}</div>
    ),
  } = config;

  function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const queryClient = useQueryClient();

    const {
      data: authenticatable,
      error,
      status,
      isLoading,
      isIdle,
      isSuccess,
      refetch,
    } = useQuery<Authenticatable, Error>({
      queryKey: key,
      queryFn: loadAuthenticatable,
    });

    const setAuthenticatable = React.useCallback(
      (data: Authenticatable) => queryClient.setQueryData(key, data),
      [queryClient]
    );

    const loginMutation = useMutation({
      mutationFn: loginFn,
      onSuccess: authenticatable => {
        setAuthenticatable(authenticatable);
      },
    });

    const registerMutation = useMutation({
      mutationFn: registerFn,
      onSuccess: authenticatable => {
        setAuthenticatable(authenticatable);
      },
    });

    const logoutMutation = useMutation({
      mutationFn: logoutFn,
      onSuccess: () => {
        queryClient.clear();
      },
    });

    const value = React.useMemo(
      () => ({
        authenticatable,
        error,
        refetchAuthenticatable: refetch,
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isLoading,
        logout: logoutMutation.mutateAsync,
        isLoggingOut: logoutMutation.isLoading,
        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isLoading,
      }),
      [
        authenticatable,
        error,
        refetch,
        loginMutation.mutateAsync,
        loginMutation.isLoading,
        logoutMutation.mutateAsync,
        logoutMutation.isLoading,
        registerMutation.mutateAsync,
        registerMutation.isLoading,
      ]
    );

    if (isSuccess || !waitInitial) {
      return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      );
    }

    if (isLoading || isIdle) {
      return <LoaderComponent />;
    }

    if (error) {
      return <ErrorComponent error={error} />;
    }

    return <div>Unhandled status: {status}</div>;
  }

  function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
      throw new Error(`useAuth must be used within an AuthProvider`);
    }
    return context;
  }

  return { AuthProvider, AuthConsumer: AuthContext.Consumer, useAuth };
}
