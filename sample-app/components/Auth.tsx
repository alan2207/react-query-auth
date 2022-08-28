import * as React from 'react';

import { LoginCredentials, RegisterCredentials, useAuth } from '../lib/auth';
import { useForm } from '../hooks/useForm';

export function Auth() {
  const [mode, setMode] = React.useState<'login' | 'register'>('login');

  return (
    <>
      {mode === 'login' && (
        <>
          <Login />
          <Button
            style={{ marginTop: '20px' }}
            onClick={() => setMode('register')}
          >
            I am new here
          </Button>
        </>
      )}

      {mode === 'register' && (
        <>
          <Register />
          <Button
            style={{ marginTop: '20px' }}
            onClick={() => setMode('login')}
          >
            I already have an account
          </Button>
        </>
      )}
    </>
  );
}

function Register() {
  const { register } = useAuth();
  const { values, onChange } = useForm<RegisterCredentials>();

  return (
    <Form
      title="Register"
      onSubmit={(e) => {
        e.preventDefault();
        register.mutate(values, {
          onSuccess: () => console.log('registered'),
        });
      }}
      error={register.error}
    >
      <Input
        autoComplete="new-password"
        placeholder="email"
        name="email"
        onChange={onChange}
      />
      <Input placeholder="name" name="name" onChange={onChange} />
      <Input
        type="password"
        placeholder="password"
        name="password"
        onChange={onChange}
      />
      <Button disabled={register.isLoading} type="submit">
        Submit
      </Button>
    </Form>
  );
}

function Login() {
  const { login } = useAuth();
  const { values, onChange } = useForm<LoginCredentials>();

  return (
    <Form
      title="Login"
      onSubmit={(e) => {
        e.preventDefault();
        login.mutate(values);
      }}
      error={login.error}
    >
      <Input
        autoComplete="new-password"
        placeholder="email"
        name="email"
        onChange={onChange}
      />
      <Input
        type="password"
        placeholder="password"
        name="password"
        onChange={onChange}
      />
      <Button disabled={login.isLoading} type="submit">
        Submit
      </Button>
    </Form>
  );
}

const Form = ({
  title,
  children,
  onSubmit,
  error,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: unknown;
}) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2>{title}</h2>
      <form
        onSubmit={onSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {children}
      </form>
      <>
        {error && (
          <div style={{ color: 'tomato' }}>
            {JSON.stringify(error, null, 2)}
          </div>
        )}
      </>
    </div>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      style={{
        border: '1px solid #ccc',
        fontSize: '1.2rem',
        borderRadius: '4px',
        padding: '8px',
      }}
    />
  );
};

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      style={{
        fontSize: '1.2rem',
        borderRadius: '4px',
        background: 'white',
        border: '1px solid black',
        cursor: 'pointer',
      }}
    />
  );
};
