const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (request, response) => {
  const { body } = request;
  const { username, password } = body;

  if (username === "" || password == "") {
    response.status(404).json({
      error: "Not found",
    });
    return;
  }

  const user = await User.findOne({ username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    response.status(401).json({
      error: "Invalid user or password",
    });
    return;
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  });

  response.send({
    name: user.name,
    username: user.username,
    token,
  });
});

module.exports = loginRouter;
