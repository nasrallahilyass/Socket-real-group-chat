const express = require("express");
const app = express();
const path = require("path");
const PORT = 4000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));

const io = require("socket.io")(server);
let sockesConnected = new Set();

const onConnection = (socket) => {
  console.log("Socked Id:", socket.id);
  sockesConnected.add(socket.id);
  // Send the number of connected clients to all clients
  io.emit("Connected-Client", sockesConnected.size);

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    sockesConnected.delete(socket.id);
    io.emit("connected", sockesConnected.size);
  });

  socket.on("message", (data) => {
    console.log("Message received on server:", data);
    socket.broadcast.emit("chat-message", data);
  }); 


  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
};



io.on("connection", onConnection);
