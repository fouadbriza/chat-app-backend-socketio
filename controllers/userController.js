const User = require("../models/user");

exports.me = async (req, res, next) => {
  try {
    const id = req.userId;
    console.log(typeof(id));
    const userobject = await User.findById(id);
    if (!userobject) {
      res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json(userobject);
  } catch (err) {
    next(err);
  }
};
