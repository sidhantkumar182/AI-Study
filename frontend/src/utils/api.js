import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL;
const baseURL = envApiUrl
  ? (envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl.replace(/\/$/, '')}/api`)
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if available
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

// Response interceptor: Handle 401 Unauthorized only for protected routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthEndpoint && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),
};

export const pdfAPI = {
  list: (params) => api.get('/pdf', { params }),
  get: (id) => api.get(`/pdf/${id}`),
  upload: (formData) => api.post('/pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/pdf/${id}`),
};

export const chatAPI = {
  listConversations: () => api.get('/chat/conversation'),
  getConversation: (id) => api.get(`/chat/conversation/${id}`),
  createConversation: (data) => api.post('/chat/conversation', data),
  renameConversation: (id, title) => api.put(`/chat/conversation/${id}/rename`, { title }),
  deleteConversation: (id) => api.delete(`/chat/conversation/${id}`),
  sendMessage: (id, message) => api.post(`/chat/conversation/${id}/message`, { message }),
};

export const summaryAPI = {
  getSummary: (pdfId) => api.get(`/summary/${pdfId}`),
  generateShort: (pdfId) => api.post(`/summary/${pdfId}/short`),
  generateBullets: (pdfId) => api.post(`/summary/${pdfId}/bullets`),
  generateDetailed: (pdfId) => api.post(`/summary/${pdfId}/detailed`),
  generateConcepts: (pdfId) => api.post(`/summary/${pdfId}/concepts`),
  generateTerms: (pdfId) => api.post(`/summary/${pdfId}/terms`),
};

export const flashcardAPI = {
  listDecks: () => api.get('/flashcards'),
  getDeck: (id) => api.get(`/flashcards/${id}`),
  generate: (data) => api.post('/flashcards/generate', data),
  deleteDeck: (id) => api.delete(`/flashcards/${id}`),
  toggleBookmark: (deckId, cardId) => api.put(`/flashcards/${deckId}/card/${cardId}/bookmark`),
  reviewCard: (deckId, cardId, masteryLevel) => api.put(`/flashcards/${deckId}/card/${cardId}/review`, { masteryLevel }),
};

export const quizAPI = {
  listQuizzes: () => api.get('/quiz'),
  getQuiz: (id) => api.get(`/quiz/${id}`),
  generate: (data) => api.post('/quiz/generate', data),
  submit: (id, data) => api.post(`/quiz/${id}/submit`, data),
  getResults: (id) => api.get(`/quiz/${id}/results`),
  deleteQuiz: (id) => api.delete(`/quiz/${id}`),
};

export const plannerAPI = {
  getPlanner: () => api.get('/planner'),
  createTask: (data) => api.post('/planner/task', data),
  updateTask: (taskId, data) => api.put(`/planner/task/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/planner/task/${taskId}`),
  updateGoal: (targetHours) => api.put('/planner/goal', { targetHours }),
  logSession: (data) => api.post('/planner/log', data),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getOverview: () => api.get('/analytics/overview'),
  logActivity: (data) => api.post('/analytics/activity', data),
};

export default api;
