import { Authenticatable } from '../api';

const authenticatables: Record<string, Authenticatable> = JSON.parse(
  window.localStorage.getItem('db_authenticatables') || '{}'
);

const blackListEmails = ['hacker@mail.com', 'asd@mail.com'];

export function setAuthenticatable(data: Authenticatable) {
  if (data?.email && !blackListEmails.includes(data?.email)) {
    authenticatables[data.email] = data;
    window.localStorage.setItem(
      'db_authenticatables',
      JSON.stringify(authenticatables)
    );
    return data;
  } else {
    return null;
  }
}

export function getAuthenticatable(email: string) {
  return authenticatables[email];
}
