import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserAsync,
  signupUserAsync,
  forgotPasswordAsync,
  updateUserAsync
} from "../actions/auth";

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.token = action.payload.token || null;
      state.user = action.payload || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      // Clear chatbot conversation from local storage
      localStorage.removeItem('chatbotConversation');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.token = action.payload.token || null;
        state.user = action.payload || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.token = action.payload.token || null;
        state.user = action.payload || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUserAsync.fulfilled, (state, action) => {
        state.token = action.payload.token || null;
        state.user = action.payload || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(signupUserAsync.rejected, (state, action) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(forgotPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state) => {
        // You can adjust the state as needed, e.g., set a message saying "Reset link sent!"
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { authRequest, authSuccess, authFailure, logout, clearError } =
  authSlice.actions;

export default authSlice.reducer;
