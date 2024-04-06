import express from 'express';
import UserController from './user.controller.js';

const userRouter = express.Router();

// Define user routes
userRouter.post('/signup', UserController.signup);
userRouter.post('/signin', UserController.signin);

export default userRouter;
