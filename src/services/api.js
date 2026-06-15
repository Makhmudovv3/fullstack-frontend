import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fullstack-backend-tplh.onrender.com/api', // Backend URL
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
