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
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => {
      return api.post('/auth/login', credentials);
    },
    register: (userData) => {
      return api.post('/auth/register', userData);
    },
    getUser: () => {
      return api.get('/auth/me')
        .then(response => {
          return response;
        })
        .catch(err => {
          throw err;
        });
    },
    resetPasswordRequest: (email) => {
      return api.post('/auth/forgotpassword', { email });
    },
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
  
  // Profile endpoints
  profiles: {
    getCurrentProfile: () => api.get('/profiles/me'),
    getProfileByUserId: (userId) => api.get(`/profiles/user/${userId}`),
    updateProfile: (profileData) => api.put('/profiles', profileData),
    addExperience: (experienceData) => api.post('/profiles/experience', experienceData),
    deleteExperience: (experienceId) => api.delete(`/profiles/experience/${experienceId}`),
    addEducation: (educationData) => api.post('/profiles/education', educationData),
    deleteEducation: (educationId) => api.delete(`/profiles/education/${educationId}`),
    addSkill: (skillData) => api.post('/profiles/skills', skillData),
    deleteSkill: (skillId) => api.delete(`/profiles/skills/${skillId}`)
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
    rejectRequest: (id) => api.put(`/referrals/requests/${id}/reject`),
    getRequestsByJob: (jobId) => api.get(`/referrals/jobs/${jobId}`),
    addReferralNote: (id, note) => api.post(`/referrals/${id}/notes`, { note }),
    uploadAttachment: (id, formData) => api.post(`/referrals/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // Notification endpoints
  notifications: {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`)
  },
  
  // Stats endpoints
  getStats: (endpoint) => api.get(endpoint),
  getUserStats: (period = 'all') => api.get(`/stats/user?period=${period}`),
  getReferralStats: (period = 'all') => api.get(`/stats/referrals?period=${period}`),
  getJobStats: (period = 'all') => api.get(`/stats/jobs?period=${period}`),
  getPlatformStats: () => api.get('/stats/platform'),
  getDashboardStats: (period = 'all') => api.get(`/stats/dashboard?period=${period}`),
  
  // Messaging endpoints - Direct methods rather than nested object
  getConversations: () => api.get('/conversations'),
  getOrCreateConversation: (userId) => api.post('/conversations', { recipient_id: userId }),
  getMessages: (conversationId, page = 1, limit = 20) => 
    api.get(`/conversations/${conversationId}/messages`, { params: { page, limit } }),
  sendMessage: (conversationId, messageData) => 
    api.post(`/conversations/${conversationId}/messages`, messageData),
  markMessagesAsRead: (conversationId) => 
    api.put(`/conversations/${conversationId}/read`)
};

// For backward compatibility
export default apiService; 