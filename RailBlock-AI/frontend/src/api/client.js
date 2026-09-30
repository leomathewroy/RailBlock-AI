import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    const url = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  // Production default to Render backend if running on Netlify/web
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://railblock-ai-3.onrender.com/api';
  }
  return '/api';
};

const client = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
