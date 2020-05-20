const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");

const sessions = {};

function restrict() {
  // put in a variable so it can be reused
  const authError = {
    message: "Invalid credentials",
  };

  return async (req, res, next) => {
    // console.log(req.headers);
    try {
      // make sure you use correct headers when testing!!
      // const { username, password } = req.headers;

      // // make sure the values aren't empty
      // if (!username || !password) {
      //   return res.status(401).json(authError);
      // }
      // console.log("checkpoint 1");

      // const user = await Users.findBy({ username }).first();

      // // make sure user exists
      // if (!user) {
      //   return res.status(401).json(authError);
      // }
      // console.log("checkpoint 2");

      // const passwordValid = await bcrypt.compare(password, user.password);

      // // make sure password is correct
      // if (!passwordValid) {
      //   return res.status(401).json(authError);
      // }
      // console.log("checkpoint 3");
      // if we reach this point, the user is authenticated!

      // const { authorization } = req.headers;
      // if (!sessions[authorization]) {
      //   return res.status(401).json(authError);
      // }

      // we no longer need to check for username and password
      // instead we can just check for an authorization header

      // const { cookie } = req.headers;
      // // YOU FORGOT THE "S" IN HEADERS AND IT TOOK YOU AN HOUR TO FIGURE OUT
      // // WHY THE COOKIE WAS NOT BEING STORED TO THE GET USERS ROUTE
      // // B/C THERE WAS NO FEEDACK OR ERRORS!!!!!!!!!!!!!!!!!!
      // if (!cookie) {
      //   return res.status(401).json(authError);
      // }

      // const authToken = cookie.replace("token=", "");
      // console.log(sessions[authToken]);
      // if (!sessions[authToken]) {
      //   return res.status(401).json(authError);
      // }

      if (!req.session || !req.session.user) {
        return res.status(401).json(authError);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  sessions,
  restrict,
};
