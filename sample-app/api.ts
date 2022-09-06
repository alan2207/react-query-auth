import { storage } from './utils';

interface AuthResponse {
  authenticatable: Authenticatable;
  jwt: string;
}

export interface Authenticatable {
  id: string;
  email: string;
  name?: string;
}

export async function handleApiResponse(response) {
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}

export async function getAuthenticatableProfile() {
  return await fetch('/auth/me', {
    headers: {
      Authorization: storage.getToken(),
    },
  }).then(handleApiResponse);
}

export async function loginWithEmailAndPassword(data): Promise<AuthResponse> {
  return window
    .fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(handleApiResponse);
}

export async function registerWithEmailAndPassword(
  data
): Promise<AuthResponse> {
  return window
    .fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    .then(handleApiResponse);
}
