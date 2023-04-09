import "./ChatWindow.css";
import { useState } from "react";
const ChatWindow = (props) => {
  const [senderMessage, setSenderMessage] = useState();

  return (
    <>
      <div className="chat-window">
        <div className="chat-bubble__reciever my-2">Heyyy!!</div>
        <div className="chat-bubble__sender my-2">Heyyy!!</div>
        <div className="chat-bubble__sender">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
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
          className="send-button"
          onClick={(e) => {
            e.preventDefault();
            props.messagesToBeSent(senderMessage);
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
