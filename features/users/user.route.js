import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

const userRouter = express.Router();

// Define user routes
userRouter.post('/signup', UserController.signup);
userRouter.post('/signin', UserController.signin);
userRouter.post('/signout', jwtAuth, UserController.signout);

export default userRouter;
