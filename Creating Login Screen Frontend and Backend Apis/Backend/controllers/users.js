const User = require("../models/user");

exports.postSignupData = async (req, res, next) => {
  try {
    if (!req.body.username) {
      throw new Error("Name is Mandatory");
    }

    if (!req.body.email) {
      throw new Error("Email is Mandatory");
    }

    if (!req.body.password) {
      throw new Error("Password is Mandatory");
    }

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

exports.postLoginData = async (req, res, next) => {
  try {
    if (!req.body.email) {
      throw new Error("Email is Mandatory");
    }

    if (!req.body.password) {
      throw new Error("Password is Mandatory");
    }

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    if (user.password === password) {
      return res
        .status(200)
        .json({ success: true, message: "User logged in successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
};