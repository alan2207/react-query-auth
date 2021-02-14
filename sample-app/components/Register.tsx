import React from 'react';
import { useAuth } from '../lib/auth';
import { useForm } from '../hooks/useForm';

export function Register() {
  const { register } = useAuth();
  const { values, onChange } = useForm();
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
        {error && (
          <div style={{ color: 'tomato' }}>
            {JSON.stringify(error, null, 2)}
          </div>
        )}
      </form>
    </div>
  );
}
