import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const base_url = "https://us-central1-maristhungerexpress.cloudfunctions.net/api"

// Asynchronous thunk for logging in
export const loginUserAsync = createAsyncThunk(
    'auth/loginUserAsync',
    async (credentials, thunkAPI) => {
        const { email, password } = credentials;
        try {
            const response = await axios.post(`${base_url}/user/login`, {
                email,
                password: password
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Error logging in.");
        }
    }
);

export const updateUserAsync = createAsyncThunk(
    'auth/updateUserAsync',
    async (body, thunkAPI) => {
        try {
            const response = await axios.put(`${base_url}/user/update/${body.username}`, body);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Error updating user.");
        }
    }
);

// For Signup
export const signupUserAsync = createAsyncThunk(
    'auth/signupUserAsync',
    async (credentials, thunkAPI) => {
        const { email, password, firstName, lastName, address } = credentials; // Destructure address from credentials
        try {
            const response = await axios.post(`${base_url}/user/create`, {
                email,
                password: password,
                firstName,
                lastName,
                address // Include address in the payload
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Error signing up.");
        }
    }
);

// For Forgot Password
export const forgotPasswordAsync = createAsyncThunk(
    'auth/forgotPasswordAsync',
    async (email, thunkAPI) => {
        try {
            const response = await axios.post(`${base_url}/user/reset-password`, {
                email
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Error sending reset link.");
        }
    }
);

export const resetPasswordAsync = createAsyncThunk(
    'auth/resetPasswordAsync',
    async (body, thunkAPI) => {
        const {password, email, token} = body;
        try {
            const response = await axios.post(`${base_url}/user/change-password`, {
                password,
                email
            }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Error changing password.");
        }
    }
);