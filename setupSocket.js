const verifySocketToken = require("./middleware/verifySocketToken");
const Message = require("./models/message");
const onlineUsers = new Map();
const User = require("./models/user");

const setupSocket = (io) => {
  io.use(verifySocketToken);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.username);
    onlineUsers.set(socket.username, socket.id);

    //Message Sending
    socket.on("sendMessage", async ({ to, message }) => {
      const user = await User.findOne({username:to});

      if (!user) {
        console.warn('user not found'); 
        return }

      const targetSocketId = onlineUsers.get(to);

      //Db storage
      const savedMessage = new Message({
        from: socket.username,
        to:to,
        message: message,
        timestamp: new Date(),
        delivered: false,
        read:false
        });
      await savedMessage.save();

      if (targetSocketId) {
        socket.to(targetSocketId).emit("receiveMessage", {
          from: socket.username,
          message,
          _id: savedMessage._id
        });

        await Message.updateOne(
        { _id: savedMessage._id },
        { $set: { delivered: true } });

      } else {
      console.log(`User ${to} is offline. Message qued.`);
      }
    });

    //this handles the message being read (add read status)
    socket.on("readMessage" , async ({messageId}) => {
      await Message.updateOne(
     { _id: messageId },
     { $set: { read: true } });
     console.log(messageId);
     const themessage = await Message.findById(messageId);
     if (!themessage) {
      console.error('Message not found in the DB (read state handler)');
      return }

     const senderUserName = themessage.from;
     const senderSocket = onlineUsers.get(senderUserName);

     if (!senderSocket) {
      console.error('couldnt find the sender socket');
     return }

     socket.to(senderSocket).emit('messageRead', {
      messageId,
      by: socket.username
    });

    } );

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconected`);
      onlineUsers.delete(socket.username);
    });
  });
};

module.exports = setupSocket;

/*
  socket.on('chatMessage', async (msg) => {
    
    io.emit("chatMessage", {
    from: socket.username,
    message: msg
    });

    const message = new Message({
    from: socket.username,
    message: msg,
    timestamp: new Date()
    });
    await message.save(); // if you're using async


  }) */
