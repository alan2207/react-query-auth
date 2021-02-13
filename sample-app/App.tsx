import React from 'react';
import { useAuth } from './lib/auth';
import { useForm } from './utils';

export function Auth() {
  const [mode, setMode] = React.useState<'login' | 'register'>('login');

  return (
    <div>
      <div>
        {mode === 'login' && (
          <>
            <Login />
            <button
              style={{ marginTop: '20px' }}
              onClick={() => setMode('register')}
            >
              Go To Register
            </button>
          </>
        )}
      </div>
      <div>
        {mode === 'register' && (
          <>
            <Register />
            <button
              style={{ marginTop: '20px' }}
              onClick={() => setMode('login')}
            >
              Go To Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Login() {
  const { login } = useAuth();
  const { values, onChange } = useForm({});
  const [error, setError] = React.useState(null);
  return (
    <div>
      Login
      <form
        onSubmit={async e => {
          e.preventDefault();
          try {
            await login(values);
          } catch (err) {
            setError(err);
          }
        }}
      >
        <input
          autoComplete="new-password"
          placeholder="email"
          name="email"
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={onChange}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <div>{JSON.stringify(error, null, 2)}</div>}
    </div>
  );
}

function Register() {
  const { register } = useAuth();
  const { values, onChange } = useForm({});
  const [error, setError] = React.useState(null);

  return (
    <div>
      Register
      <form
        onSubmit={async e => {
          e.preventDefault();
          try {
            await register(values);
          } catch (err) {
            setError(err);
          }
        }}
      >
        <input
          autoComplete="new-password"
          placeholder="email"
          name="email"
          onChange={onChange}
        />
        <input placeholder="name" name="name" onChange={onChange} />
        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={onChange}
        />
        <button type="submit">Submit</button>
        {error && <div>{JSON.stringify(error, null, 2)}</div>}
      </form>
    </div>
  );
}

export function UserInfo() {
  const { user, logout } = useAuth();
  return (
    <div>
      Welcome {user.name}
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
}

export function App() {
  const { user } = useAuth();
  return user ? <UserInfo /> : <Auth />;
}
