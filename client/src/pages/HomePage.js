import axios from "axios";
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import ChatRoomPage from "./ChatRoomPage";
import "./HomePage.css";
const HomePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [members, setMembers] = useState([]);
  const [isAddingChatRoom, setIsAddingChatRoom] = useState(false);
  const [users, setUsers] = useState([]);

  const UserId = useSelector((state) => state.chat.userId);
  const userId = String(UserId);
  let friendRequests = [];
  const logoutHandler = async () => {
    await axios
      .get("http://localhost:8000/logout")
      .then(navigate("/login", { replace: true }));
  };

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/all-users").then((res) => {
      console.log(res.data);
      setUsers(res.data);
    });
  };

  const sendFriendRequest = async (friendUserId) => {
    await axios.post("http://localhost:8000/send-friend-req", {
      senderUser: state.userId,
      friendUserId,
    });
  };

  const addFriend = async (friendUserId) => {
    await axios.post("http://localhost:8000/add-friend", {
      user: state.userId,
      friend: friendUserId,
    });
  };

  const addRoom = async () => {
    await axios
      .post("http://localhost:8000/add-room", {
        userId,
        roomId,
        roomName,
      })
      .then((res) => {
        if (res.ok) {
          console.log("success");
        }
        console.log(res.status);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  state.friendRequests.map((requests) => {
    friendRequests = users.find((user) => {
      return user._id === requests.from;
    });
  });

  console.log(friendRequests);
  return (
    <>
      <h1>Home</h1>
      <button
        className="btn btn-dark"
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </button>
      {state !== null && (
        <>
          <div className="container">
            <div className="row">
              <div className="col">
                <h1>Hello, {state.name}</h1>
                <h2>{state.username}</h2>

                <Stack direction="row" spacing={3}>
                  <Button variant="outlined" onClick={logoutHandler}>
                    Logout
                  </Button>
                  <Button variant="outlined" onClick={logoutHandler}>
                    Add Friend
                  </Button>
                </Stack>
                <Stack
                  direction="row"
                  spacing={3}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    variant="contained"
                    style={{ marginBottom: "20px" }}
                    onClick={() => {
                      setIsAddingChatRoom(true);
                    }}
                  >
                    Add a chat room
                  </Button>
                  <Button variant="contained" style={{ marginBottom: "20px" }}>
                    Start a chat
                  </Button>
                </Stack>
                <div className="users-list">
                  <h3>Users</h3>
                  {users
                    .filter((user) => {
                      return user.username !== state.username;
                    })
                    .map((user, index) => {
                      return (
                        <div className="users-accounts">
                          <p>@{user.username}</p>
                          <button
                            onClick={() => {
                              sendFriendRequest(user._id);
                            }}
                          >
                            Add Friend
                          </button>
                        </div>
                      );
                    })}
                </div>
                <div className="friend-requests">
                  <h3>Friend Requests</h3>
                  <div className="requests">
                    <p>{friendRequests.username}</p>
                    <button
                      onClick={() => {
                        addFriend(friendRequests._id);
                      }}
                    >
                      Accept Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: "20px" }}>
              <div className="col">
                {isAddingChatRoom && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { m: 1, width: "25ch" },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <div>
                        <h1 style={{ fontSize: "28px" }}>
                          Creating chat room as {state.username}
                        </h1>

                        <TextField
                          required
                          id="outlined-required"
                          label="Chat Room Name"
                          onChange={(e) => {
                            setRoomName(e.target.value);
                          }}
                        />
                        <TextField
                          required
                          id="outlined-required"
                          label="Chat room Id"
                          onChange={(e) => {
                            setRoomId(e.target.value);
                          }}
                        />
                        <Button variant="contained">+ Add members</Button>
                        <Stack direction="row" spacing={2}>
                          <Button
                            color="secondary"
                            onClick={() => {
                              setIsAddingChatRoom(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={addRoom}
                          >
                            Create Room
                          </Button>
                        </Stack>
                      </div>
                    </Box>
                  </form>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <ChatRoomPage />
    </>
  );
};
export default HomePage;
