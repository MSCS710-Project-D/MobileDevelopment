import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (userId) => {
        const response = await axios.get(`YOUR_API_ENDPOINT/users/${userId}`);
        return response.data;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: null,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: {
        [fetchUserData.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'succeeded';
        },
    }
});

export default userSlice.reducer;
