import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import expressWinston from 'express-winston';
import flash from 'connect-flash';
import userRouter from './features/users/user.route.js';
import jwtAuth from './middlewares/jwt.middleware.js';
import bandwidthRouter from './features/bandwidth/bandwidth.route.js';
import { defaultLogger, errorLogger } from './middlewares/logger.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { invalidRoutesHandlerMiddleware } from './middlewares/invalidRoutes.middleware.js';

// 2. Create Server
const server = express();

// Load all the environment variables in the application
dotenv.config();

server.use(express.json({limit: '1000mb'})); // Initialize json middleware
server.use(cookieParser()); // Initialize cookie-parser middleware
server.use(express.urlencoded({ extended: true,  limit: '1000mb', parameterLimit: 10000000000}));
server.use(express.static('public'));

// Set up session middleware
server.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Using connect-flash to display flash notification in FE
server.use(flash());

server.use(expressWinston.logger({
    winstonInstance: defaultLogger,
    statusLevels: true
}));

// Set EJS as the view engine
server.set('view engine', 'ejs');

// Set the views directory
server.set('views', './views');

// Route for rendering layout.ejs
server.get('/', (req, res) => {
    // Pass flash messages to the template
    res.render('layout', { userName: null, messages: req.flash() ,excelData: null });
});

// Mount user routes
server.use('/user', userRouter);

// Apply JWT authentication middleware to all routes except signup and signin
server.use(jwtAuth);

// Mount user routes
server.use('/bandwidth', bandwidthRouter);

// Middleware to handle errors
server.use(errorHandlerMiddleware);

server.use(invalidRoutesHandlerMiddleware);

server.use(errorLogger);

// 5. Specify port.
server.listen(8000, () => {
    console.log('Server is running at 8000');
});
