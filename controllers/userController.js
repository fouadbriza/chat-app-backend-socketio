const User = require("../models/user");

exports.me = async (req, res, next) => {
  try {
    const id = req.userId;
    const userobject = await User.findById(id);
    if (!userobject) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json(userobject);
  } catch (err) {
    next(err);
  }
};


exports.edit = async (req,res,next) => {
  try {
  const {username, password ,oldPassword} = req.body;
  const userId = req.userId;
  if (!username && !password) {
    return res.status(400).json({ message: "at least one field is required to update" });
  }

  const thisuser = await User.findById(userId).select('+password');
  if (!thisuser) {
    return res.status(404).json({ message: "User not found" });}
  if (username) thisuser.username = username;
  
  if (password) {
    if (!(await thisuser.comparePassword(oldPassword))) {
    return res.status(400).json({ message: "old password is incorrect" });
  }

  thisuser.password = password;
}

  await thisuser.save();
  return res.status(200).json({ message: "user info updated successfully" });


  } catch(err) {
    next(err)
  }

}