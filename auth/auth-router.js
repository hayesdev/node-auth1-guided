const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const { sessions, restrict } = require("../middleware/restrict");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await Users.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    res.status(201).json(await Users.add(req.body));
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();
    // hashing user password with time complexity of 14
    // const hash = await bcrypt.hash(password, 14);
    const passwordValid = await bcrypt.compare(password, user.password);
    // since bcrypt hashes generate different password due to the salting,
    // we rely on magic internals to compare hashes rather than doing it manually

    if (!user || !passwordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // const authToken = Math.random();
    // sessions[authToken] = user.id;

    // // res.setHeader("Authorization", authToken);
    // res.setHeader("Set-Cookie", `token=${authToken}; Path=/; HttpOnly`);

    req.session.user = user;

    res.json({
      message: `Welcome ${user.username}!`,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", restrict(), (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.json({
        message: "Successfully logged out",
      });
    }
  });
});

module.exports = router;
