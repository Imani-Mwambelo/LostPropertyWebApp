// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://0775-196-249-93-124.ngrok-free.app',
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
