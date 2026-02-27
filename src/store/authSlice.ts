import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "./api";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Set user on successful login
    builder.addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
      if (!payload.mfaRequired) {
        state.user = payload.user;
        state.isAuthenticated = true;
      }
    });
    // Set user on successful Google login
    builder.addMatcher(api.endpoints.googleLogin.matchFulfilled, (state, { payload }) => {
      if (!payload.mfaRequired) {
        state.user = payload.user;
        state.isAuthenticated = true;
      }
    });
    // Set user on profile fetch
    builder.addMatcher(api.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
      state.user = payload.data?.user ?? payload.data;
      state.isAuthenticated = true;
    });
    // Clear user on profile fetch failure (not authenticated)
    builder.addMatcher(api.endpoints.getProfile.matchRejected, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
    // Update user on profile update
    builder.addMatcher(api.endpoints.updateProfile.matchFulfilled, (state, { payload }) => {
      const updated = payload.data?.user;
      if (updated?._id) state.user = updated;
    });
    // Clear user on logout
    builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
