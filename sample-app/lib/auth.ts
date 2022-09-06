import { initReactQueryAuth } from '../../src';
import {
  getAuthenticatableProfile,
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  Authenticatable,
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

async function handleAuthenticatableResponse(data) {
  const { jwt, authenticatable } = data;
  storage.setToken(jwt);
  return authenticatable;
}

async function loadAuthenticatable() {
  let authenticatable = null;

  if (storage.getToken()) {
    const data = await getAuthenticatableProfile();
    authenticatable = data;
  }
  return authenticatable;
}

async function loginFn(data: LoginCredentials) {
  const response = await loginWithEmailAndPassword(data);
  const authenticatable = await handleAuthenticatableResponse(response);
  return authenticatable;
}

async function registerFn(data: RegisterCredentials) {
  const response = await registerWithEmailAndPassword(data);
  const authenticatable = await handleAuthenticatableResponse(response);
  return authenticatable;
}

async function logoutFn() {
  await storage.clearToken();
}

const authConfig = {
  loadAuthenticatable,
  loginFn,
  registerFn,
  logoutFn,
};

const { AuthProvider, AuthConsumer, useAuth } = initReactQueryAuth<
  Authenticatable,
  any,
  LoginCredentials,
  RegisterCredentials
>(authConfig);

export { AuthProvider, AuthConsumer, useAuth };
