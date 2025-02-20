import express from 'express';
import { GetAllUsers, login, register } from '../controller/UserController.js';
import { upload } from '../midilware/cloudinary.js';
import verifyToken from '../midilware/VerifyToken.js';

const router = express.Router();

router.post('/signup', upload.single('image'), register);
router.post('/login', login);
router.get('/getallusers',verifyToken, GetAllUsers);

export default router;