const verifySocketToken = require("./middleware/verifySocketToken");
const Message = require("./models/message");

const setupSocket = (io) => {
io.use(verifySocketToken);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

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


  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconected`)
  })


}


);

}

module.exports = setupSocket;