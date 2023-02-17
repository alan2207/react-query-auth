export type DBUser = {
  email: string;
  name: string;
  password: string;
};

const users: Record<string, DBUser> = JSON.parse(
  typeof window !== 'undefined'
    ? window.localStorage.getItem('db_users') || '{}'
    : '{}'
);

export function setUser(data: DBUser) {
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
