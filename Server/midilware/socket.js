import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = new Map(); // Stores userId -> socketId

io.on("connection", (socket) => {
  console.log(`✅ A user connected: ${socket.id}`);

  // Register user with their socket ID
  socket.on("register", (userId) => {
    if (userId) {
      users.set(userId, socket.id);
      console.log(`🔹 User registered: ${userId} -> ${socket.id}`);
    } else {
      console.log("⚠️ Invalid userId received for registration.");
    }
  });

  // Handle sending messages
  socket.on("sendMessage", ({ senderId, receiverId, content }) => {
    if (!senderId || !receiverId || !content) {
      console.log("⚠️ Missing senderId, receiverId, or content.");
      return;
    }

    console.log(`📨 Message from ${senderId} to ${receiverId}: ${content}`);

    const receiverSocketId = users.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", { senderId, content });
      console.log(`✅ Message sent to ${receiverId} at ${receiverSocketId}`);
    } else {
      console.log(`🚫 User ${receiverId} is offline or not registered.`);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    let disconnectedUser = null;

    for (const [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        disconnectedUser = userId;
        users.delete(userId);
        break;
      }
    }

    console.log(`❌ A user disconnected: ${socket.id} (User ID: ${disconnectedUser || "Unknown"})`);
  });
});

export { app, server };
