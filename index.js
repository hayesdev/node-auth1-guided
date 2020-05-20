const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const dbConfig = require("./database/config");

const server = express();
const port = process.env.PORT || 5000;

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(
  session({
    name: "token", // overwrites default cookie name, hides our stack better
    resave: false, // avoid recreating sessions if they haven't changed
    saveUninitialized: false, // GDPR laws against setting cookies automatically
    secret: process.env.COOKIE_SECRET || "secret", // cryptographically sign the cookie
    cookie: {
      httpOnly: true, // disallow JS to read cookie content
      //   maxAge: 60 * 1000, // expires the cookie after 60 seconds
    },
    store: new KnexSessionStore({
      knex: dbConfig, // configured instance of knex
      createTable: true, // if the session table doesn't exist, create automatically
    }),
  })
);

server.use("/auth", authRouter);
server.use("/users", usersRouter);

server.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to our API",
  });
});

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong",
  });
});

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
