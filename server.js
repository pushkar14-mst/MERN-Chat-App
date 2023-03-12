const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

app.use(
  session({
    secret: "f2feca#@425oI9",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session(session));
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors({ origin: "http://localhost:3000" }));

mongoose.connect("mongodb://localhost:27017/chatAppDB");

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  username: { type: String },
  password: { type: String, require: true, length: 16 },
  room: { type: Array },
  messages: { type: Array },
  friends: { type: Array },
  friendRequests: { type: Array },
});

const User = mongoose.model("User", userSchema);

//register
app.post("/register", async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  let password = req.body.password;

  const takenUsername = User.findOne({ username: username });

  if (!takenUsername) {
    res.json({
      message:
        "Sorry the username is already taken, please try something different",
    });
  } else {
    password = await bcrypt.hash(password, 10);
    const user = new User({ name, username, password });
    console.log(user);
    await user.save();
    res.json({ message: "success" });
  }
});

//login
// app.post("/login", async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   console.log(username);
//   User.find({ username: username }).then((user) => {
//     if (!user) {
//       res.json({ message: "invalid username" });
//     }

//     let dbPassword = user.map((u) => {
//       return u.password;
//     });
//     let dbUsername = user.map((u) => {
//       return u.username;
//     });
//     let dbUserId = user.map((u) => {
//       return u.id;
//     });
//     bcrypt.compare(password, dbPassword.toString()).then((isCorrect) => {
//       if (isCorrect) {
//         const payload = {
//           id: dbUserId.toString(),
//           username: dbUsername.toString(),
//         };
//         jwt.sign(
//           payload,
//           process.env.JWT_SECRET,
//           { expiresIn: 89000 },
//           (err, token) => {
//             if (err) return res.json({ message: err });
//             console.log(token);
//             return res.json({ message: "success", token: "Bearer" + token });
//           }
//         );
//       } else {
//         res.json({ message: "invalid username or password" });
//       }
//     });
//   });
// });

// //jwt verification
// function verifyJWT(req, res, next) {
//   const token = req.headers["x-access-token"]?.split(" ")[1];
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err)
//         return res.json({ isLoggedIn: false, message: "failed to verify JWT" });
//       req.user = {};
//       req.user.id = decoded.id;
//       req.user.username = decoded.username;
//       next();
//     });
//   } else {
//     res.json({ message: "Invalid JWT token" });
//   }
// }

// app.get("/user-authentication", verifyJWT, (req, res) => {
//   res.json({ isLoggedIn: true, username: req.user.username });
// });

//Socket Funtioning

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) return done(null, false);

        console.log(password);
        console.log(user.password);
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false); // if passwords match return user
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, false);
      }
    }
  )
);

app.post(
  "/auth/login",
  passport.authenticate("local-login"),
  (req, res, next) => {
    // login
    jwt.sign(
      { user: req.body },
      "*F-JaNcRfUjXn2r5u8x/A?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQfTjWmZq4t7w!",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            message: "Failed to login",
            token: null,
          });
        }
        const loggedInUser = jwt.decode(token).user.username;

        User.findOne({ username: loggedInUser }).then((user) => {
          res.json({
            isAuthenticated: true,
            token,
            user,
          });
        });
      }
    );
  }
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      password: user.password,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey:
        "*F-JaNcRfUjXn2r5u8x/A?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQfTjWmZq4t7w!",
    },
    (jwtPayload, done) => {
      console.log(jwtPayload);
      User.findOne({ username: jwtPayload.username }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);
app.get("/all-users", async (req, res) => {
  await User.find({}).then((user) => {
    res.json(user);
  });
});

// User.find({ _id: toBeFriend }, (err, user) => {
//   user.map((user) => {
//     return user.friendRequests[0].from === senderUser;
//   });
// });
app.post("/send-friend-req", async (req, res) => {
  const senderUser = req.body.senderUser;
  const toBeFriend = req.body.friendUserId;

  User.findById(toBeFriend, (err, user) => {
    if (err) {
      console.log(err);
      return res.json({ message: "An error occurred while finding user" });
    }

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const existingRequest = user.friendRequests.find(
      (request) => request.from === senderUser
    );
    if (existingRequest) {
      console.log("you have already requested this user");
      return res.json({ message: "You have already requested this user" });
    }

    user.friendRequests.push({ from: senderUser });
    user
      .save()
      .then((result) => {
        console.log(result);
        res.json({ message: "Friend request sent successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          message: "An error occurred while sending friend request",
        });
      });
  });
});

app.post("/add-friend", async (req, res) => {
  const user = req.body.user;
  const friend = req.body.friend;
  console.log(user, friend);
  await User.updateOne({ _id: user }, { $push: { friends: { friend } } }).then(
    (res) => {
      console.log(res);
    }
  );
  User.updateOne({ _id: friend }, { $push: { friends: { user } } }).then(
    (res) => {
      console.log(res);
    }
  );
});

app.post("/add-room", async (req, res) => {
  const data = req.body;
  const currentUserId = req.body.userId;
  const roomId = req.body.roomId;
  const roomName = req.body.roomName;
  const members = req.body.members;
  // await Student.updateOne({ _id: 1 }, { $push: { friends: 'Maria' } })

  User.updateOne(
    { _id: currentUserId },
    { $push: { room: { roomId, roomName } } }
  ).then((res) => {
    console.log(res);
  });
  User.find({}).then((user) => {
    user.map((u) => {
      console.log(u);
    });
  });
});

app.get("/logout", function (req, res) {
  req.session.destroy(function () {
    res.clearCookie("connect.sid"); //clears session id cookie
  });
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.broadcast.emit("you are connected to the chat room");
  socket.on("chat message", (msg) => {
    console.log(msg);
  });
});
server.listen(8000, () => {
  console.log("listening on *:8000");
});