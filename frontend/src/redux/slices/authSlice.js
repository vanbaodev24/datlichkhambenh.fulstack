import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authAPI.login(credentials);
    if (res.errCode === 0) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data;
    }
    return rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authAPI.register(data);
    if (res.errCode === 0) return res.data;
    return rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message || 'Register failed');
  }
});

const storedUser = localStorage.getItem('user');
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s) => { s.loading = false; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
