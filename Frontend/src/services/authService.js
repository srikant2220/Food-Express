import api from './api.js';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};