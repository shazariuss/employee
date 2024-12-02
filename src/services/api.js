import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: (username, email, password) => 
    api.post('/register', { username, email, password }),
  
  login: (email, password) => 
    api.post('/login', { email, password })
};

