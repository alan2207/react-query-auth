import React from 'react';
import { useAuth } from '../lib/auth';

export function AuthenticatableInfo() {
  const { authenticatable, logout } = useAuth();
  return (
    <div>
      Welcome {authenticatable?.name}
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
}
