import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  apiService,
  User,
  LoginCredentials,
  CreateUserData,
  UpdateUserData,
} from '../services/api';

// Auth state
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Users state
interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
  viewMode: 'list' | 'card';
}

// Root state
export interface RootState {
  auth: AuthState;
  users: UsersState;
}

// Initial states
const initialAuthState: AuthState = {
  isAuthenticated: !!(
    localStorage.getItem('token') || sessionStorage.getItem('token')
  ),
  token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  loading: false,
  error: null,
};

const initialUsersState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  },
  searchQuery: '',
  viewMode: 'list',
};

// Auth async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);

      // Store token based on rememberMe preference
      if (credentials.rememberMe) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('token', response.token);
        localStorage.removeItem('rememberMe');
      }

      return response.token;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
      // return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rememberMe');
  sessionStorage.removeItem('token');
});

// Users async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (
    { page, perPage }: { page: number; perPage: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getUsers(page, perPage);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch users'
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.getUser(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch user'
      );
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserData, { rejectWithValue }) => {
    try {
      const response = await apiService.createUser(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create user'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (
    { id, userData }: { id: number; userData: UpdateUserData },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.updateUser(id, userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update user'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiService.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to delete user'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = null;
      });
  },
});

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState: initialUsersState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'list' | 'card'>) => {
      state.viewMode = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{ page: number; perPage: number }>
    ) => {
      state.pagination.page = action.payload.page;
      state.pagination.perPage = action.payload.perPage;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          perPage: action.payload.per_page,
          total: action.payload.total,
          totalPages: action.payload.total_pages,
        };
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError: clearAuthError } = authSlice.actions;
export const {
  setSearchQuery,
  setViewMode,
  setPagination,
  clearError: clearUsersError,
} = usersSlice.actions;

export { authSlice, usersSlice };
