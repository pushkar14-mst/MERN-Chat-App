import "./ChatWindow.css";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3000");

const ChatWindow = (props) => {
  const {
    allUsers,
    getAllUsers,
    currentUser,
    activeUser,
    latestSentMessage,
    latestRecievedMessage,
  } = props;
  const [senderMessage, setSenderMessage] = useState();

  let senderHistory = [];
  let recieverHistory = [];
  console.log(latestRecievedMessage);
  const buttonRef = useRef();

  console.log(allUsers);

  allUsers
    .filter((user) => {
      return user.name === currentUser;
    })
    .map((user) => {
      user.messages.map((message) => {
        console.log(message);

        if (message !== null) {
          if (message.hasOwnProperty("to")) {
            console.log(message.to);
            if (message.to === activeUser) {
              senderHistory.push(message.message);
            }
          }
          //console.log(message);
        }
      });
    });
  allUsers
    .filter((user) => {
      return user.name === currentUser;
    })
    .map((user) => {
      user.messages.map((message) => {
        console.log(message);

        if (message !== null) {
          if (message.hasOwnProperty("from")) {
            console.log(message.from);
            if (message.from === activeUser) {
              recieverHistory.push(message.message);
            }
          }
          //console.log(message);
        }
      });
    });
  console.log(currentUser);
  console.log(activeUser);
  console.log(senderHistory);
  console.log(recieverHistory);
  return (
    <>
      <div className="chat-window">
        {recieverHistory.map((recievedMessage) => {
          return (
            <div className="chat-bubble__reciever my-2">{recievedMessage}</div>
          );
        })}

        {senderHistory.map((senderMessage) => {
          return (
            <div className="chat-bubble__sender my-2">{senderMessage}</div>
          );
        })}
        <div className="chat-bubble__sender my-2">{latestSentMessage}</div>
        <div className="chat-bubble__reciever my-2">
          {latestRecievedMessage}
        </div>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          className="message-input"
          value={senderMessage}
          onChange={(e) => {
            setSenderMessage(e.target.value);
          }}
        />
        <button
          ref={buttonRef}
          className="send-button"
          onClick={(e) => {
            e.preventDefault();
            props.messagesToBeSent(senderMessage);
            getAllUsers();
            setSenderMessage("");
          }}
        >
          Send
        </button>
      </div>
    </>
  );
};
export default ChatWindow;
