const Message = require("../models/message");
const express = require('express');
const router = express.Router();

router.get('/discussion/:recipient' , async (req,res,next) => {
    const recipient = req.params.recipient;
    const sender = req.username;
    try {
    const messagesArr = await Message.find({
    $or: [
      { from: sender, to: recipient },
      { from: recipient, to: sender } ] 
     }).sort({ timestamp: 1 });

  res.status(200).json(messagesArr);

    } catch(err) {
    next(err) }
})
    

module.exports = router;