import React from 'react';
import { useForm } from '../hooks/useForm';
import { LoginCredentials, useAuth } from '../lib/auth';

export function Login() {
  const { login } = useAuth();
  const { values, onChange } = useForm<LoginCredentials>();
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
      {error && (
        <div style={{ color: 'tomato' }}>{JSON.stringify(error, null, 2)}</div>
      )}
    </div>
  );
}
