import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  name: "",
  username: "",
  password: "",
  room: [],
  message: [],
};
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    registerUser(state, action) {
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
    addLoggedInUser(state, action) {
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.console.log(state);
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
  },
});

export const chatAction = chatSlice.actions;
export default chatSlice;
