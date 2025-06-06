// lib/toolsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  likedTools: [], // Array of tool IDs or full tool objects
  likedToolsStatus: 'idle',
};

export const fetchTools = createAsyncThunk('tools/fetchTools', async () => {
  const response = await axios.get('/api/tools');
  return response.data;
});

export const fetchLikedTools = createAsyncThunk('tools/fetchLikedTools', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return rejectWithValue('User not authenticated');
  try {
    const response = await axios.get('/api/user/likes');
    return response.data; // Array of liked tool objects
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch liked tools');
  }
});

export const toggleLikeTool = createAsyncThunk('tools/toggleLikeTool', async ({ toolId, isLiked }, { dispatch, getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return rejectWithValue('User not authenticated');
  try {
    if (isLiked) { // Currently liked, so unlike
      await axios.delete(`/api/tools/${toolId}/like`);
    } else { // Currently not liked, so like
      await axios.post(`/api/tools/${toolId}/like`);
    }
    dispatch(fetchLikedTools()); // Re-fetch liked tools to update the state
    return { toolId, wasLiked: isLiked }; // Return action performed
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle like');
  }
});


const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTools.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchLikedTools.pending, (state) => {
        state.likedToolsStatus = 'loading';
      })
      .addCase(fetchLikedTools.fulfilled, (state, action) => {
        state.likedToolsStatus = 'succeeded';
        // Store the full tool objects from the API payload
        state.likedTools = action.payload; // <<<< MODIFIED HERE
      })
      .addCase(fetchLikedTools.rejected, (state) => {
        state.likedToolsStatus = 'failed';
        state.likedTools = [];
      })
      // When user logs out, clear liked tools
      .addCase("auth/signOutUser/fulfilled", (state) => {
        state.likedTools = [];
        state.likedToolsStatus = 'idle';
      });
  },
});

export default toolsSlice.reducer;