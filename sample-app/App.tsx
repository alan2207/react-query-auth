import React from 'react';
import { Auth } from './components/Auth';
import { AuthenticatableInfo } from './components/AuthenticatableInfo';
import { useAuth } from './lib/auth';

export function App() {
  const { authenticatable } = useAuth();
  return authenticatable ? <AuthenticatableInfo /> : <Auth />;
}
