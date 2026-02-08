import axios from 'axios';

const API_BASE_URL = 'https://localhost:7178/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
};

export const dispensingAPI = {
  createRecord: (formData) =>
    axios.post(`${API_BASE_URL}/dispensingrecords/create`, formData, {
      timeout: 3000,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  getRecords: (filters) =>
    apiClient.post('/dispensingrecords/list', filters),
  downloadFile: (filename) =>
    apiClient.get(`/dispensingrecords/download/${filename}`, {
      timeout: 3000,
      responseType: 'blob',
    }),
};

export default apiClient;
