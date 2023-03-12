import React from "react";
import { Route, Routes } from "react-router";
import ChatRoomPage from "./pages/ChatRoomPage";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat-room/:roomId" element={<ChatRoomPage />} />
      </Routes>
    </>
  );
}

export default App;
