import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method?.toUpperCase(), config.url); // Debug
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.config.url, response.status); // Debug
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Better error message
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Network error. Please check if backend is running.';
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Properties API (giữ nguyên các hàm khác...)
// Properties API
export const propertiesAPI = {
  getAll: async () => {
    const response = await api.get('/properties');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data.data;
  },

  create: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data.data;
  },

  update: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },
  getForMap: async (bounds = null, status = null) => {
    const params = new URLSearchParams();
    if (bounds) params.append('bounds', JSON.stringify(bounds));
    if (status) params.append('status', status);
    const response = await api.get(`/properties/map?${params}`);
    return response.data.data;
  },

  getNearby: async (lat, lng, radius = 10) => {
    const response = await api.get(`/properties/location?lat=${lat}&lng=${lng}&radius=${radius}`);
    return response.data.data;
  },

  search: async (filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/properties/search?${params}`);
    return response.data.data;
  }
};

// Sellers API
export const sellersAPI = {
  getAll: async () => {
    const response = await api.get('/sellers');
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/sellers/${id}`);
    return response.data.data;
  },

  create: async (sellerData) => {
    const response = await api.post('/sellers', sellerData);
    return response.data.data;
  },

  update: async (id, sellerData) => {
    const response = await api.put(`/sellers/${id}`, sellerData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/sellers/${id}`);
    return response.data;
  }
};

// Statistics API
export const statsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/stats/dashboard');
    return response.data.data;
  }
};