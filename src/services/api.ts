import axios from 'axios';

const API_BASE_URL = 'https://reqres.in/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'reqres-free-v1',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if it's a login/register request - let the login component handle the error
      const isAuthRequest =
        error.config?.url?.includes('/login') ||
        error.config?.url?.includes('/register');

      if (!isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
}

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export interface CreateUserData {
  name: string;
  job: string;
}

export interface UpdateUserData {
  name?: string;
  
}

export interface UserResponse {
  data: User;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export const apiService = {
  // Auth
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/register', credentials);
    return response.data;
  },

  // Users
  getUsers: async (
    page: number = 1,
    perPage: number = 10
  ): Promise<UsersResponse> => {
    const response = await api.get(`/users?page=${page}&per_page=${perPage}`);
    return response.data;
  },

  getUser: async (id: number): Promise<UserResponse> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserData): Promise<CreateUserResponse> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (
    id: number,
    userData: UpdateUserData
  ): Promise<CreateUserResponse> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default api;
