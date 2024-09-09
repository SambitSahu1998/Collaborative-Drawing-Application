const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

//routes

app.get("/", (req, res) => {
  res.send("This is MERN Collaborative Drawing Application");
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    socket.emit("UserIsJoined", { success: true });
    socket.broadcast
      .to(roomId)
      .emit("whiteBoardDataResponse", { imgURL: imgURLGlobal });
  });

  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse",{
        imgURL:data,
    });
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log("Server is running on http://localhost:5000")
);
