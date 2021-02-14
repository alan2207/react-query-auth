import React from 'react';
import { Login } from './Login';
import { Register } from './Register';

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
