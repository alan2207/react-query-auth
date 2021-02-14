import React from 'react';
import { useQuery, useQueryClient, UseQueryResult } from 'react-query';

export interface AuthProviderConfig<User, Error> {
  key?: string;
  loadUser: (data: unknown) => Promise<User>;
  loginFn: (data: unknown) => Promise<User>;
  registerFn: (data: unknown) => Promise<User>;
  logoutFn: () => Promise<any>;
  renderLoader?: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;
  onLoginSuccess?: (user: User) => void | Promise<void>;
  onRegisterSuccess?: (user: User) => void | Promise<void>;
  onLogoutSuccess?: () => void | Promise<void>;
  onLoginError?: (error: Error) => void;
  onRegisterError?: (error: Error) => void;
  onLogoutError?: (error: Error) => void;
}

export interface AuthContextValue<User, Error> {
  user: User | undefined;
  login: (data: any) => Promise<User>;
  logout: () => Promise<boolean>;
  register: (data: any) => Promise<User>;
  refetch: (options: {
    throwOnError: boolean;
    cancelRefetch: boolean;
  }) => Promise<UseQueryResult>;
  error: Error | null;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function initReactQueryAuth<User = unknown, Error = unknown>(
  config: AuthProviderConfig<User, Error>
) {
  const AuthContext = React.createContext<AuthContextValue<User, Error>>(
    {} as AuthContextValue<User, Error>
  );
  AuthContext.displayName = 'AuthContext';

  const {
    loadUser,
    loginFn,
    registerFn,
    logoutFn,
    key = 'auth-user',
    renderLoader = () => <div>Loading...</div>,
    renderError = (error: Error) => (
      <div style={{ color: 'tomato' }}>{JSON.stringify(error, null, 2)}</div>
    ),
    onLoginSuccess = () => {},
    onLoginError = () => {},
    onRegisterSuccess = () => {},
    onRegisterError = () => {},
    onLogoutSuccess = () => {},
    onLogoutError = () => {},
  } = config;

  function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const queryClient = useQueryClient();

    const {
      data: user,
      error,
      status,
      isLoading,
      isIdle,
      isSuccess,
      refetch,
    } = useQuery<User, Error>({
      queryKey: key,
      queryFn: loadUser,
    });

    const setUser = React.useCallback(
      data => queryClient.setQueryData(key, data),
      [key, queryClient]
    );

    const login = React.useCallback(
      async data => {
        try {
          const user = await loginFn(data);
          setUser(user);
          onLoginSuccess(user);
          return user;
        } catch (error) {
          onLoginError(error);
          return Promise.reject(error);
        }
      },
      [loginFn, onLoginError, onLoginSuccess, setUser]
    );

    const register = React.useCallback(
      async data => {
        try {
          const user = await registerFn(data);
          setUser(user);
          onRegisterSuccess(user);
          return user;
        } catch (error) {
          onRegisterError(error);
          return Promise.reject(error);
        }
      },
      [onRegisterError, onRegisterSuccess, registerFn, setUser]
    );

    const logout = React.useCallback(async () => {
      try {
        await logoutFn();
        setUser(null);
        queryClient.clear();
        onLogoutSuccess();
        return true;
      } catch (error) {
        onLogoutError(error);
        return Promise.reject(error);
      }
    }, [logoutFn, onLogoutError, onLogoutSuccess, queryClient, setUser]);

    const value = React.useMemo(
      () => ({ user, login, logout, register, error, refetch }),
      [login, logout, user, register, error, refetch]
    );

    if (isLoading || isIdle) {
      return <>{renderLoader()}</>;
    }

    if (error) {
      return <>{renderError(error)}</>;
    }

    if (isSuccess) {
      return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      );
    }

    return <>Unhandled status: {status}</>;
  }

  function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
      throw new Error(`useAuth must be used within an AuthProvider`);
    }
    return context;
  }

  return { AuthProvider, useAuth };
}
