// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://28ed-196-249-93-52.ngrok-free.app',
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
