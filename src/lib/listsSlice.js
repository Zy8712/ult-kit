// store/slices/listsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  userLists: [],      // Array of { id, name, userId, createdAt }
  currentList: null,  // { id, name, items: [tool objects] }
  status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchUserLists = createAsyncThunk('lists/fetchUserLists', async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return rejectWithValue('User not authenticated');
    try {
        const response = await axios.get('/api/lists');
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch lists');
    }
});

export const createNewList = createAsyncThunk('lists/createNewList', async ({ name }, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return rejectWithValue('User not authenticated');
    try {
        const response = await axios.post('/api/lists', { name });
        dispatch(fetchUserLists()); // Refresh lists
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create list');
    }
});

export const fetchListDetails = createAsyncThunk('lists/fetchListDetails', async (listId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return rejectWithValue('User not authenticated');
    try {
        const response = await axios.get(`/api/lists/${listId}`);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch list details');
    }
});

export const addToolToList = createAsyncThunk('lists/addToolToList', async ({ listId, toolId }, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return rejectWithValue('User not authenticated');
    try {
        await axios.post(`/api/lists/${listId}/items`, { toolId });
        dispatch(fetchListDetails(listId)); // Refresh current list details
        // Optionally, also refresh all user lists if summary data changes
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add tool to list');
    }
});

export const removeToolFromList = createAsyncThunk('lists/removeToolFromList', async ({ listId, toolId }, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return rejectWithValue('User not authenticated');
    try {
        await axios.delete(`/api/lists/${listId}/items`, { data: { toolId } }); // DELETE with body
        dispatch(fetchListDetails(listId));
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to remove tool from list');
    }
});

export const deleteList = createAsyncThunk('lists/deleteList', async (listId, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return rejectWithValue('User not authenticated');
    try {
        await axios.delete(`/api/lists/${listId}`);
        dispatch(fetchUserLists()); // Refresh lists
        // if currentList.id === listId, clear currentList
        const { lists } = getState();
        if (lists.currentList && lists.currentList.id === listId) {
            return { listId, wasCurrent: true}; // Signal to clear currentList
        }
        return { listId, wasCurrent: false};
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete list');
    }
});


const listsSlice = createSlice({
    name: 'lists',
    initialState,
    reducers: {
        clearCurrentList: (state) => {
            state.currentList = null;
        },
        clearListsError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch User Lists
            .addCase(fetchUserLists.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchUserLists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userLists = action.payload;
            })
            .addCase(fetchUserLists.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.userLists = [];
            })
            // Fetch List Details
            .addCase(fetchListDetails.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchListDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentList = action.payload;
            })
            .addCase(fetchListDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.currentList = null;
            })
            // Create List
            .addCase(createNewList.rejected, (state, action) => { state.error = action.payload; })
            // Delete List
            .addCase(deleteList.fulfilled, (state, action) => {
                if (action.payload.wasCurrent) {
                    state.currentList = null;
                }
                // userLists will be updated by fetchUserLists thunk
            })
            .addCase(deleteList.rejected, (state, action) => { state.error = action.payload; })
            // Add/Remove Tool (no direct state change, relies on refetch)
            .addCase(addToolToList.rejected, (state, action) => { state.error = action.payload; })
            .addCase(removeToolFromList.rejected, (state, action) => { state.error = action.payload; })
            // When user logs out, clear lists
            .addCase("auth/signOutUser/fulfilled", (state) => {
                state.userLists = [];
                state.currentList = null;
                state.status = 'idle';
                state.error = null;
            });
    },
});

export const { clearCurrentList, clearListsError } = listsSlice.actions;
export default listsSlice.reducer;