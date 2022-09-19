export const storage = {
  getToken: () => {
    const token = window.localStorage.getItem('token');
    if (token === null) return null;
    JSON.parse(token);
  },
  setToken: (token) =>
    window.localStorage.setItem('token', JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem('token'),
};
