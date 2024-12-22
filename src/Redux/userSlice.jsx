import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;
