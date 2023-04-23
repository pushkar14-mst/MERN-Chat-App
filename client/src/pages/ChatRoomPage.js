import React, { useEffect, useState } from "react";
import "./ChatRoomPage.css";
import io from "socket.io-client";
import { MantineProvider } from "@mantine/core";
import ChatSideBar from "../components/ChatSideBar/ChatSideBar";
import { useLocation } from "react-router";
import axios from "axios";
import ChatWindow from "../components/ChatWindow/ChatWindow";
const socket = io("http://localhost:3000");

const ChatRoomPage = (props) => {
  const [allUsers, setAllUsers] = useState([]);
  const [activeUser, setActiveUser] = useState();
  const [latestSentMessage, setLatestSentMessage] = useState();
  const [latestRecievedMessage, setLatestRecievedMessage] = useState();

  const { state } = useLocation();

  console.log(state);
  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/all-users").then((res) => {
      setAllUsers(res.data);
    });
  };

  const sendMessage = (senderMessage) => {
    if (senderMessage.length > 0) {
      socket.emit("chat message", {
        sender: state.name,
        to: activeUser,
        message: senderMessage,
      });
    }

    getAllUsers();
  };

  useEffect(() => {
    getAllUsers();
    console.log("connected:", socket.connected);

    socket.on("latest message", (latestMessage) => {
      console.log("latestMessage Is", latestMessage);
      if (latestMessage.hasOwnProperty("to")) {
        setLatestSentMessage(latestMessage.message);
      }
      if (latestMessage.hasOwnProperty("sender")) {
        setLatestRecievedMessage(latestMessage.message);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  let friends = [];
  state.friends.map((friendId) => {
    allUsers
      .filter((friends) => {
        return friends._id === friendId.user;
      })
      .map((user) => {
        friends.push(user);
      });
  });
  console.log(friends);
  console.log(activeUser);
  const handleActiveUser = (active) => {
    setActiveUser(active);

    const roomName = `${state.name}-${active}`;
    socket.emit("join-room", roomName);
  };
  return (
    <>
      <MantineProvider
        theme={{
          fontFamily: "Verdana, sans-serif",
          fontFamilyMonospace: "Monaco, Courier, monospace",
          headings: {
            fontFamily: "Greycliff CF, sans-serif",
          },
          colors: {
            "ocean-blue": [
              "#7AD1DD",
              "#5FCCDB",
              "#44CADC",
              "#2AC9DE",
              "#1AC2D9",
              "#11B7CD",
              "#09ADC3",
              "#0E99AC",
              "#128797",
              "#147885",
            ],
          },
        }}
      >
        {/* {friends.map((allFriends) => {
          console.log(allFriends);
          return <ChatSideBar friends={allFriends} />;
        })} */}
        <div style={{ display: "flex" }}>
          <ChatSideBar friends={friends} activeUser={handleActiveUser} />
          <div style={{ width: "100%" }}>
            <ChatWindow
              messagesToBeSent={sendMessage}
              allUsers={allUsers}
              currentUser={state.name}
              activeUser={activeUser}
              getAllUsers={getAllUsers}
              latestSentMessage={latestSentMessage}
              latestRecievedMessage={latestRecievedMessage}
            />
          </div>
        </div>
      </MantineProvider>
    </>
  );
};
export default ChatRoomPage;
