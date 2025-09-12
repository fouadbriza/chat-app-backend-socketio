const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
require("dotenv").config();
const cors = require('cors');

const errorHandler = require("./middleware/errorHandler");
const auth = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const verifyToken = require("./middleware/verifyToken");
app.use(express.json());
const setupSocket = require('./setupSocket');
const chatRoutes = require('./routes/chatRoutes');

//Server: Socket.IO’s server class   // server: http main server
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app); //main server creation



app.use(cors({ origin: '*', credentials: true }));





// Create a new Socket.IO Server instance (io) from the Socket.IO Server class (Server) and attaching it to our existing HTTP server (server) created with http.createServer(app) so Socket.IO automatically detects HTTP requests with `Upgrade: websocket` and perform the WebSocket handshake following the settings in the second argument object

const io = new Server(server, {
  cors: { origin: '*' /*origin: `${process.env.FRONTEND_ORIGIN}`*/ , methods: ["GET", "POST"] },
  pingTimeout: 30000,
  pingInterval: 25000,
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server started successfully at ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));


//Rest  
app.use("/api", auth);
app.use("/api",verifyToken, userRoutes);
app.use("/api",verifyToken, chatRoutes);
app.use(errorHandler);



//Socket.IO
setupSocket(io);






/*const newMessage = new Message({
  from: socket.username,
  message: msg,
  timestamp: new Date()
});
await newMessage.save();
*/