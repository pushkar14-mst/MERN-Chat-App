import axios from "axios";
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { useSelector } from "react-redux";
import ChatRoomPage from "./ChatRoomPage";
import "./HomePage.css";
import {
  createStyles,
  Navbar,
  Group,
  getStylesRef,
  rem,
  Title,
  Text,
  MantineProvider,
  TextInput,
  Button,
  Grid,
} from "@mantine/core";
import {
  IconSwitchHorizontal,
  IconLogout,
  IconHome,
  IconFriends,
  IconArrowsLeftRight,
  IconUserPlus,
  IconSearch,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: [
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

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        ?.background,
      0.1
    )}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor })
        ?.background,
      0.1
    )}`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          ?.background,
        0.1
      ),
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.white,
    opacity: 0.75,
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          ?.background,
        0.15
      ),
      [`& .${getStylesRef("icon")}`]: {
        opacity: 0.9,
      },
    },
  },
}));
const data = [
  { link: "", label: "Home", icon: IconHome },
  { link: "", label: "Friends", icon: IconFriends },
  { link: "", label: "Friend Requests", icon: IconArrowsLeftRight },
  { link: "", label: "Add a Friend", icon: IconUserPlus },
];
const HomePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [members, setMembers] = useState([]);
  const [isAddingChatRoom, setIsAddingChatRoom] = useState(false);

  const [users, setUsers] = useState([]);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Home");
  const UserId = useSelector((state) => state.chat.userId);
  const userId = String(UserId);

  let friendRequests = [];
  let friends = [];
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
  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));
  state.friendRequests.map((requests) => {
    friendRequests = users.find((user) => {
      return user._id === requests.from;
    });
  });

  state.friends.map((friendId) => {
    users
      .filter((friends) => {
        return friends._id === friendId.user;
      })
      .map((user) => {
        friends.push(user);
      });
  });
  console.log(friends);
  console.log(friendRequests);

  return (
    <>
      {state === null && (
        <button
          className="btn btn-dark"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      )}

      {state !== null && (
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
            <div style={{ display: "flex" }}>
              <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
                <Navbar.Section grow>
                  <Group className={classes.header} position="apart">
                    <Title order={2} color="white">
                      Hii, {state.name}
                    </Title>
                  </Group>
                  {links}
                </Navbar.Section>

                <Navbar.Section className={classes.footer}>
                  <a
                    href="#"
                    className={classes.link}
                    onClick={(event) => event.preventDefault()}
                  >
                    <IconSwitchHorizontal
                      className={classes.linkIcon}
                      stroke={1.5}
                    />
                    <span>Change account</span>
                  </a>

                  <a
                    href="#"
                    className={classes.link}
                    onClick={(event) => event.preventDefault()}
                  >
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span onClick={logoutHandler}>Logout</span>
                  </a>
                </Navbar.Section>
              </Navbar>
              {active === "Home" && (
                <div className="home">
                  <Title order={1} color="ocean-blue">
                    Good Morning!!
                  </Title>

                  <Button
                    color="cyan"
                    onClick={() => {
                      return navigate("/chat-page", { state: state });
                    }}
                  >
                    Go to Chats
                  </Button>
                </div>
              )}
              {active === "Add a Friend" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Title order={1} color="ocean-blue">
                      Users
                    </Title>
                    <Group>
                      <IconSearch />
                      <TextInput placeholder="Search..." />
                    </Group>
                  </div>
                  {/* <div className="users-list">
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
                  </div> */}
                </>
              )}
              {active === "Friend Requests" && (
                <div className="friend-requests">
                  <h3>Friend Requests</h3>
                  <div className="requests">
                    {friendRequests && (
                      <>
                        <p>{friendRequests.username}</p>
                        <button
                          onClick={() => {
                            addFriend(friendRequests._id);
                          }}
                        >
                          Accept Request
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </MantineProvider>
          {/* <div className="container">
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
          </div> */}
        </>
      )}
      {/* <ChatRoomPage friends={friends} /> */}
    </>
  );
};
export default HomePage;
