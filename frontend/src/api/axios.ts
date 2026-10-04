import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for attaching bearer tokens if stored in memory/storage)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kalptaru_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = error.response?.data || {
      success: false,
      message: error.message || 'Network error encountered',
    };
    return Promise.reject(customError);
  }
);
