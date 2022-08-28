import * as React from 'react';
import { initReactQueryAuth } from '../../src';
import {
  getUserProfile,
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  AuthResponse,
} from '../api';
import { storage } from '../utils';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  name: string;
  password: string;
};

async function handleUserResponse(data: AuthResponse) {
  const { jwt, user } = data;
  storage.setToken(jwt);
  return user;
}

async function loadUser() {
  const { user } = await getUserProfile();
  return user ?? null;
}

async function loginFn(data: LoginCredentials) {
  const response = await loginWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

async function registerFn(data: RegisterCredentials) {
  const response = await registerWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

function logoutFn() {
  storage.clearToken();
}

export const {
  AuthProvider,
  AuthConsumer,
  AuthLoader,
  useAuth,
} = initReactQueryAuth({
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
  userQueryOptions: {
    refetchOnWindowFocus: false,
    retry: 0,
  },
});
