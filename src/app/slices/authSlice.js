// authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define initial state
const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

// Define async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userCredentials, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:3200/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userCredentials),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ errorMessage: error.message });
    }
  }
);

// Define auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    user: JSON.parse(localStorage.getItem('user')) || null, // Initialize user from localStorage
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user'); 
    },
  },
  extraReducers: (builder) => {
    builder
     .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token; 
        localStorage.setItem('user', JSON.stringify({user: action.payload.user, token: action.payload.token})); 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.errorMessage;
      });
  },
});

// Export action creators and reducer
export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
