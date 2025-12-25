import axios from 'axios';

// ✅ Vite uses import.meta.env and VITE_ prefix
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is not defined');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const chatAPI = {
  sendMessage: (data) => api.post('/chat/send', data),
  sendAnonymousMessage: (data) => api.post('/chat/anonymous', data),
  getChatHistory: () => api.get('/chat/history'),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllChats: () => api.get('/admin/chats'),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  deleteChat: (chatId) => api.delete(`/admin/chats/${chatId}`),
};

export default api;
