import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth APIs
export const authAPI = {
  login: (username, password, role) => 
    api.post('/auth/login', { username, password, role }),
  
  register: (formData) => 
    api.post('/auth/register', formData),
  
  checkUsername: (username, currentUserId) => 
    api.post('/auth/check-username', { username, currentUserId })
};

// Location APIs
export const locationAPI = {
  update: (userId, latitude, longitude) => 
    api.post('/location/update', { userId, latitude, longitude }),
  
  get: (userId) => 
    api.get(`/location/${userId}`),
  
  getAll: () => 
    api.get('/locations/all')
};

// User APIs
export const userAPI = {
  getFarmers: (search = '') => 
    api.get('/users/farmers', { params: { search } }),
  
  getUser: (userId) => 
    api.get(`/users/${userId}`),
  
  updateUser: (userId, updateData) => 
    api.put(`/users/${userId}`, updateData),
  
  updateLedger: (userId, ledgerLink) => 
    api.put(`/users/${userId}/ledger`, { ledgerLink })
};

// Notification APIs
export const notificationAPI = {
  get: (userId) => 
    api.get(`/notifications/${userId}`),
  
  markAsRead: (notificationId) => 
    api.put(`/notifications/${notificationId}/read`),
  
  delete: (notificationId) => 
    api.delete(`/notifications/${notificationId}`)
};

// Chat APIs
export const chatAPI = {
  getUnreadCount: (userId) => 
    api.get(`/chat/unread/${userId}`)
};

export default api;
