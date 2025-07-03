import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth service
export const authService = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  register: (username, email, password) => 
    api.post('/auth/register', { username, email, password }),
};

// Workout service
export const workoutService = {
  getAll: () => api.get('/workouts'),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (data) => api.post('/workouts', data),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
};

// Exercise service
export const exerciseService = {
  getByWorkoutId: (workoutId) => api.get(`/exercises/workout/${workoutId}`),
  create: (data) => api.post('/exercises', data),
  update: (id, data) => api.put(`/exercises/${id}`, data),
  delete: (id) => api.delete(`/exercises/${id}`),
};

// Log service
export const logService = {
  getAll: () => api.get('/logs'),
  getStats: () => api.get('/logs/stats'),
  create: (data) => api.post('/logs', data),
};

export default api;
