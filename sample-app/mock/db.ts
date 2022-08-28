import { User } from '../api';

const users: Record<string, User> = JSON.parse(
  window.localStorage.getItem('db_users') || '{}'
);

export function setUser(data: User) {
  if (data?.email) {
    users[data.email] = data;
    window.localStorage.setItem('db_users', JSON.stringify(users));
    return data;
  } else {
    return null;
  }
}

export function getUser(email: string | null) {
  if (email) {
    return users[email];
  }
}
