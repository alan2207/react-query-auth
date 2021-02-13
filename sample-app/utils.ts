import React from 'react';

export const storage = {
  getToken: () => JSON.parse(window.localStorage.getItem('token')),
  setToken: token =>
    window.localStorage.setItem('token', JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem('token'),
};

export async function handleUserResponse(data) {
  const { jwt, user } = data;
  storage.setToken(jwt);
  return user;
}

export function useForm(initialValues) {
  const [values, setValues] = React.useState(initialValues);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  return {
    values,
    onChange,
  };
}
