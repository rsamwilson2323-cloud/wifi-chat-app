import express from "express";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// file upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// ✅ API: upload file
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    ok: true,
    filename: req.file.filename,
    originalname: req.file.originalname,
    url: `/uploads/${req.file.filename}`
  });
});

// ✅ API: show laptop IP on webpage
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

app.get("/serverinfo", (req, res) => {
  res.json({
    ip: getLocalIP()
  });
});

// ✅ socket logic
io.on("connection", (socket) => {
  socket.on("join", ({ username, room }) => {
    socket.username = username;
    socket.room = room;

    socket.join(room);

    socket.to(room).emit("system", {
      msg: `${username} joined room: ${room}`
    });

    io.to(room).emit("users", getUsersInRoom(room));
  });

  socket.on("chat", (data) => {
    io.to(data.room).emit("chat", {
      username: data.username,
      msg: data.msg,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("file", (data) => {
    io.to(data.room).emit("file", {
      username: data.username,
      url: data.url,
      originalname: data.originalname,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    if (socket.room && socket.username) {
      socket.to(socket.room).emit("system", {
        msg: `${socket.username} left`
      });

      setTimeout(() => {
        io.to(socket.room).emit("users", getUsersInRoom(socket.room));
      }, 200);
    }
  });
});

function getUsersInRoom(room) {
  const clients = io.sockets.adapter.rooms.get(room);
  if (!clients) return [];
  const users = [];
  for (const id of clients) {
    const s = io.sockets.sockets.get(id);
    if (s?.username) users.push(s.username);
  }
  return users;
}

// ✅ run server
const PORT = 4000;

server.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIP();
  console.log(`✅ Server running on PC: http://localhost:${PORT}`);
  console.log(`✅ Open on PHONE (same WiFi): http://${ip}:${PORT}`);
});
