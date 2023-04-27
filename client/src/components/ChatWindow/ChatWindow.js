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
    latestMessage,
    activeChat,
  } = props;
  const [senderMessage, setSenderMessage] = useState();
  const [currentMessage, setCurrentMessage] = useState([]);
  let senderHistory = [];
  let recieverHistory = [];
  let socketReceivedMessages = [];
  const buttonRef = useRef();
  const recievingCheck =
    latestMessage !== undefined && latestMessage.sender === activeUser;
  console.log(allUsers);
  // if (latestMessage !== undefined) {
  //   setSenderMessage((prevState)=>{[latest.message,...prevState]})
  // }
  activeChat.map((chat) => {
    if (chat.sender === activeUser) {
      socketReceivedMessages.push(chat.message);
    }
  });
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
  console.log(currentMessage);
  return (
    <>
      <div className="chat-window__header">
        <h2>{activeUser}</h2>
      </div>
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

        {/* {latestMessage !== undefined &&
          latestMessage.sender === currentUser && (
            <div className="chat-bubble__sender my-2">
              {latestMessage.message}
            </div>
          )} */}
        {/* {latestMessage !== undefined
          ? latestMessage.sender === activeUser && (
              <div className="chat-bubble__reciever my-2">
                {latestMessage.message}
              </div>
            )
          : ""} */}

        {socketReceivedMessages.length > 0 &&
          socketReceivedMessages
            .filter((message) => {
              return message !== latestMessage.message;
            })
            .map((message) => {
              if (message === undefined) return "";
              return (
                <div className="chat-bubble__reciever my-2">{message}</div>
              );
            })}

        {currentMessage.map((message) => {
          return <div className="chat-bubble__sender my-2">{message}</div>;
        })}
        <div className="chat-bubble__reciever my-2">
          {recievingCheck && latestMessage.message}
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
            setCurrentMessage(() => {
              return [senderMessage];
            });
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
