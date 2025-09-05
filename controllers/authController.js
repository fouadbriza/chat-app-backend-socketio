const User = require("../models/user");
const jwt = require("jsonwebtoken");

//local signup controller
exports.localSignup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "both username and password are required " });
    }
    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ message: "username already taken" });
    }
    const newUser = new User({
      username: username,
      password: password,
    });
    await newUser.save();
    return res.status(201).json({ message: "User created succefully" });
  } catch (err) {
    next(err);
  }
};

//local login controller
exports.localLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "both username and password are required " });
    }
    const theuser = await User.findOne({ username });
    if (!theuser) {
      return res.status(404).json({ message: "User not found" });
    }
    const samePassword = await theuser.comparePassword(password);
    if (!samePassword) {
      return res.status(404).json({ message: "wrong username or password" });
    }
    const token = jwt.sign({ userId: theuser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      token,
      user: {
        _id: theuser._id,
        username: theuser.username,
        email: theuser.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.localLogin;
exports.googleRedirect;
exports.googleCallback;
