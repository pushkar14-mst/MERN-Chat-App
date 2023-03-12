import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import "./ChatRoomPage.css";
import io from "socket.io-client";
const socket = io();
const ChatRoomPage = (props) => {
  return (
    <>
      <h1>Chat Room</h1>
      <h3>Room Id:</h3>
      <div className="container" style={{ border: "1px solid #121212" }}>
        <div className="row">
          <div className="col-4" style={{ borderRight: "1px solid #121212" }}>
            <div className="active-user-box">
              <Stack direction="row" spacing={2}>
                <img
                  src="https://pps.whatsapp.net/v/t61.24694-24/312275896_882375832951894_1476664527601890885_n.jpg?ccb=11-4&oh=01_AdTMDUUcZebo0J5EhZRdpMMhEi1n5WUOI-iOqLlKsHZVUQ&oe=63EFAB24"
                  className="img-responsive "
                  style={{ borderRadius: "100%" }}
                />
                <h1>Pushkar</h1>
              </Stack>
            </div>
            <div className="chat-friend-box">
              <h1>User 1</h1>
              <p>Hey whats up?</p>
            </div>
            <div className="chat-friend-box">
              <h1>User 2</h1>
              <p>Hey whats up?</p>
            </div>
            <div className="chat-friend-box">
              <h1>User 3</h1>
              <p>Hey whats up?</p>
            </div>
            <div className="chat-friend-box">
              <h1>User 4</h1>
              <p>Hey whats up?</p>
            </div>
          </div>
          <div className="col-8">
            <div
              className="current-active-chat"
              style={{ marginBottom: "10px" }}
            >
              <h1>Henry</h1>
            </div>
            <div className="chat-window">
              <div className="chat-bubble__reciever my-2">Heyyy!!</div>
              <div className="chat-bubble__sender my-2">Heyyy!!</div>
              <div className="chat-bubble__sender">Howdie!!</div>
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Type a message..."
                className="message-input"
              />
              <button className="send-button">Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ChatRoomPage;
