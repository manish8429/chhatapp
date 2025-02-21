import GenerateToken from "../midilware/GenerateToken.js";
import TryCatch from "../midilware/TryCatch.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const register = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  

  const imageUrl = req.file.path;

  const user = await UserModel.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new UserModel({ name, email, password: hashedPassword, profilePicture: imageUrl });
  await newUser.save();
  const token = GenerateToken(newUser);
  res.cookie("token", token, {
    httpOnly: true,
})
  return res.status(201).json({ message: "User registered successfully", user: newUser, token });
});

export const login = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Password" });
  }
  const token = GenerateToken(user);
  res.cookie("token", token, {
    httpOnly: true,
})
  return res.status(200).json({ message: "User logged in successfully", user, token });
});

export const GetAllUsers = TryCatch(async (req, res) => {
  const loggedInUserId = req.user.id;  // Now correctly fetching ID

  const users = await UserModel.find({ _id: { $ne: loggedInUserId } }) // Exclude logged-in user
                               .select("-password"); // Exclude password from response

  res.json(users);
});


// chat system with togather

import asyncHandler from "express-async-handler";
import { Message } from "../models/Message.js";

// ✅ Fetch chat messages between two users
export const getMessages = asyncHandler(async (req, res) => {
  const { userId, otherUserId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender receiver", "name");

  res.status(200).json(messages);
});

// ✅ Send message and emit event
export const sendMessage = asyncHandler(async (req, res) => {
  const { sender, receiver, content } = req.body;

  if (!sender || !receiver || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const message = await Message.create({ sender, receiver, content });

  // Emit message to receiver using Socket.io
  req.io.to(receiver).emit("receiveMessage", message);

  res.status(201).json(message);
});


//  get messages from the database

export const getchatmassage = asyncHandler(async (req, res) => {
  try {
    const { userId, selectedUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: selectedUserId },
        { sender: selectedUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages in ascending order

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});