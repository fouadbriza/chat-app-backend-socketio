const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");
const auth = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const verifyToken = require("./middleware/verifyToken");

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server started successfully at ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/", verifyToken, auth);
app.use("/", userRoutes);

app.use(errorHandler);
