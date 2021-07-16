import { initReactQueryAuth } from '../../src';
import {
  getUserProfile,
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  User,
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

async function handleUserResponse(data) {
  const { jwt, user } = data;
  storage.setToken(jwt);
  return user;
}

async function loadUser() {
  let user = null;

  if (storage.getToken()) {
    const data = await getUserProfile();
    user = data;
  }
  return user;
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

async function logoutFn() {
  await storage.clearToken();
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
};

const { AuthProvider, AuthConsumer, useAuth } = initReactQueryAuth<
  User,
  any,
  LoginCredentials,
  RegisterCredentials
>(authConfig);

export { AuthProvider, AuthConsumer, useAuth };
