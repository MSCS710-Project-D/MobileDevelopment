import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk action to fetch user's location
export const fetchUserLocation = createAsyncThunk(
  'location/fetchUserLocation',
  (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            rejectWithValue(error.message);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    latitude: null,
    longitude: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLocation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserLocation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
      })
      .addCase(fetchUserLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default locationSlice.reducer;
