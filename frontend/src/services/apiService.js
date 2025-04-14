import axios from 'axios';

// Get API URL from environment variables or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  config => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Log errors for debugging
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getUser: () => api.get('/auth/me'),
    resetPasswordRequest: (email) => api.post('/auth/forgotpassword', { email }),
    resetPassword: (data) => api.post('/auth/resetpassword', data),
    updatePassword: (data) => api.patch('/auth/updatepassword', data),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    refreshToken: () => api.post('/auth/refresh-token'),
    linkedinAuth: () => window.location.href = `${API_URL}/auth/linkedin`
  },
  
  // User endpoints
  users: {
    updateProfile: (data) => api.put('/users/profile', data),
    updatePassword: (data) => api.patch('/auth/updatepassword', data),
    uploadAvatar: (formData) => api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getProfileByUsername: (username) => api.get(`/users/profile/${username}`)
  },
  
  // Job endpoints
  jobs: {
    getAll: (params) => api.get('/jobs', { params }),
    getById: (id) => api.get(`/jobs/${id}`),
    search: (params) => api.get('/jobs/search', { params }),
    getSaved: () => api.get('/jobs/saved'),
    saveJob: (jobId) => api.post(`/jobs/${jobId}/save`),
    unsaveJob: (jobId) => api.delete(`/jobs/${jobId}/save`),
    getTopJobs: () => api.get('/jobs/top')
  },
  
  // Company endpoints
  companies: {
    getAll: (params) => api.get('/companies', { params }),
    getById: (id) => api.get(`/companies/${id}`),
    search: (params) => api.get('/companies/search', { params }),
    getTopCompanies: () => api.get('/companies/top')
  },
  
  // Referral endpoints
  referrals: {
    getAll: (params) => api.get('/referrals', { params }),
    getById: (id) => api.get(`/referrals/${id}`),
    create: (data) => api.post('/referrals', data),
    update: (id, data) => api.put(`/referrals/${id}`, data),
    delete: (id) => api.delete(`/referrals/${id}`),
    getRequests: (params) => api.get('/referrals/requests', { params }),
    approveRequest: (id) => api.put(`/referrals/requests/${id}/approve`),
    rejectRequest: (id) => api.put(`/referrals/requests/${id}/reject`)
  },
  
  // Notification endpoints
  notifications: {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all')
  },
  
  // Messaging endpoints
  messages: {
    getConversations: () => api.get('/conversations'),
    getConversation: (id) => api.get(`/conversations/${id}`),
    getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages`),
    sendMessage: (conversationId, content) => api.post(`/conversations/${conversationId}/messages`, { content }),
    markAsRead: (messageId) => api.put(`/messages/${messageId}/read`)
  }
};

export default apiService; 