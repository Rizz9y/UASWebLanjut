import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Sesuaikan port jika berbeda
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default api;
