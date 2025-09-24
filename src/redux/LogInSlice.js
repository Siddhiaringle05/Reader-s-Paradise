// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  tokenExpiration: null,
  user: null,
  isAuthenticated: false,
  islogin:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.tokenExpiration = action.payload.tokenExpiration;
      state.user = action.payload.user;
      state.isAuthenticated = true;
         state.islogin = true; 
    },
    logout: (state) => {
      state.token = null;
      state.tokenExpiration = null;
      state.user = null;
      state.isAuthenticated = false;
            state.islogin = false;  
        
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
