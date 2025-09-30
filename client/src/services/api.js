import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
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

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API endpoints
export const apiService = {
  // Profile
  getProfile: () => api.get('/profile'),
  
  // Projects
  getProjects: (params = {}) => api.get('/projects', { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  
  // Skills
  getSkills: (category = '') => api.get('/skills', { params: { category } }),
  
  // Experience
  getExperience: () => api.get('/experience'),
  
  // Contact
  sendContact: (data) => api.post('/contact', data),
  
  // Health check
  healthCheck: () => api.get('/health'),
};

export default api;