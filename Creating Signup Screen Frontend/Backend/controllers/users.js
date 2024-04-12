const User = require("../models/user");

exports.postSignupData = async (req, res, next) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.create({
      username: username,
      email: email,
      password: password,
    });

    res.status(201).json({ newUser: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};