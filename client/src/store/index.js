import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./chat-store";

const store = configureStore({ reducer: { chat: chatSlice.reducer } });
export default store;
