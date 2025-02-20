import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import UserRouter from './routes/UseRoutes.js';
import { connectDB } from './db/Db.js';
import cors from 'cors';
import {app, server} from './midilware/socket.js';
dotenv.config();

app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data
app.use(cookieParser());
app.use(cors());
connectDB();

const PORT = process.env.PORT || 8000;

app.use('/api', UserRouter);

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
