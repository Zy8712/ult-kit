// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // npm install axios

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true, // For checking auth status on app load
  isLoading: false,     // For form submissions (sign-up, etc.)
  error: null,
  // For sign-in flow
  signInEmail: '',
  isCodeSent: false,
  signInLoading: false,
  signInError: null,
};

// Async Thunks
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/auth/me');
    return response.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const signUpUser = createAsyncThunk('auth/signUpUser', async ({ email, accessCode }, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/signup', { email, accessCode });
    return response.data; // { message, user (optional) }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Sign up failed');
  }
});

export const requestSignIn = createAsyncThunk('auth/requestSignIn', async ({ email }, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/request-signin', { email });
    return { email, message: response.data.message };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Request sign-in failed');
  }
});

export const verifySignIn = createAsyncThunk('auth/verifySignIn', async ({ email, token }, { dispatch, rejectWithValue }) => {
  try {
    // 'token' is the code from email
    const response = await axios.post('/api/auth/verify-signin', { email, token });
    dispatch(fetchCurrentUser()); // Fetch user data after successful verification
    return response.data; // { message, user }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Sign-in verification failed');
  }
});

export const signOutUser = createAsyncThunk('auth/signOutUser', async (_, { dispatch, rejectWithValue }) => {
  try {
    await axios.post('/api/auth/signout');
    // No need to dispatch fetchCurrentUser as it will fail and clear user.
    // Or explicitly clear user here.
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Sign out failed');
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.signInError = null;
    },
    setSignInEmail: (state, action) => {
      state.signInEmail = action.payload;
    },
    resetSignInFlow: (state) => {
        state.isCodeSent = false;
        state.signInEmail = '';
        state.signInError = null;
        state.signInLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Current User (Initial auth check)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isInitializing = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
        state.error = action.payload;
      })
      // Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // User needs to sign in after signup
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Request Sign In
      .addCase(requestSignIn.pending, (state) => {
        state.signInLoading = true;
        state.signInError = null;
        state.isCodeSent = false;
      })
      .addCase(requestSignIn.fulfilled, (state, action) => {
        state.signInLoading = false;
        state.signInEmail = action.payload.email;
        state.isCodeSent = true;
      })
      .addCase(requestSignIn.rejected, (state, action) => {
        state.signInLoading = false;
        state.signInError = action.payload;
      })
      // Verify Sign In
      .addCase(verifySignIn.pending, (state) => {
        state.signInLoading = true;
        state.signInError = null;
      })
      .addCase(verifySignIn.fulfilled, (state) => {
        state.signInLoading = false;
        state.signInError = null;
        state.isCodeSent = false; // User is now signed in, can reset this
        // user state will be updated by fetchCurrentUser
      })
      .addCase(verifySignIn.rejected, (state, action) => {
        state.signInLoading = false;
        state.signInError = action.payload;
      })
      // Sign Out
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
        state.isLoading = false;
        state.error = null;
        state.isCodeSent = false;
        state.signInEmail = '';
        state.signInLoading = false;
        state.signInError = null;
      });
  },
});

export const { clearAuthError, setSignInEmail, resetSignInFlow } = authSlice.actions;
export default authSlice.reducer;