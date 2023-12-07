const initialChatState = {
    conversation: [],
    // ... other chat states
  };
  
  const chatSlice = createSlice({
    name: "chat",
    initialState: initialChatState,
    reducers: {
      // ... your chat reducers
    },
    extraReducers: {
      // ... other extra reducers
      [authSlice.actions.logout]: (state) => {
        return initialChatState; // Reset chat state to initial state on logout
      },
    },
  });