import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Navigate,
  redirect,
  useNavigate,
  useParams,
} from "react-router-dom";
import { chatAction } from "../store/chat-store";
import axios from "axios";
const LoginPage = (props) => {
  const [selector, setSelector] = useState("login");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch();
  dispatch(chatAction.registerUser({ name, username, password }));
  const Name = useSelector((state) => state.chat.name);
  const Username = useSelector((state) => state.chat.username);
  const Password = useSelector((state) => state.chat.password);

  const navigate = useNavigate();
  const register = async () => {
    await axios
      .post("http://localhost:8000/register", {
        name: Name,
        username: Username,
        password: Password,
      })
      .then((res) => {
        if (res.ok) {
          console.log("success");
        }
        console.log(res.status);
      });
  };

  const login = async () => {
    await axios
      .post("http://localhost:8000/auth/login", {
        username: Username,
        password: Password,
      })
      .then((res) => {
        if (res.data.isAuthenticated) {
          let user = res.data.user;
          setAuthenticated(true);
          let userData = {
            userId: user._id,
            username: user.username,
            name: user.name,
            friendRequests: user.friendRequests,
          };
          dispatch(chatAction.setUserId(user._id));
          console.log(user);
          navigate("/home", { state: userData });
        }
      });
  };
  const handleRegister = (event) => {
    event.preventDefault();
    register();
  };
  const handleLogin = (event) => {
    event.preventDefault();
    setUsername("");
    setPassword("");
    login();
  };

  return (
    <>
      <div className="container text-center my-5">
        <h1>Login</h1>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="col-5">
            <div className="selectors">
              <button
                onClick={() => {
                  setSelector("login");
                }}
                className="btn btn-primary mx-2"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setSelector("register");
                }}
                className="btn btn-primary mx-2"
              >
                Register
              </button>
            </div>
            {selector === "login" && (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label for="exampleInputEmail1">Username</label>
                  <input
                    type="username"
                    className="form-control"
                    value={username}
                    id="exampleInputEmail1"
                    placeholder="Enter username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    id="exampleInputPassword1"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            )}
            {selector === "register" && (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label for="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label for="password">Username</label>
                  <input
                    type="username"
                    className="form-control"
                    id="username"
                    placeholder="Username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            )}
            {authenticated && (
              <>
                <h1>Authenticated!!!</h1>
                <h1>Hello</h1>
                <h2>{Username}</h2>
                <h3>{Name}</h3>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
