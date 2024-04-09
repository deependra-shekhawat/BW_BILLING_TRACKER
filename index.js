import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import userRouter from './features/users/user.route.js';
import jwtAuth from './middlewares/jwt.middleware.js';
import bandwidthRouter from './features/bandwidth/bandwidth.route.js';
import setFlash from './middlewares/flash.middleware.js';

// 2. Create Server
const server = express();

// Load all the environment variables in the application
dotenv.config();

server.use(express.json()); // Initialize json middleware
server.use(cookieParser()); // Initialize cookie-parser middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

// Set up session middleware
server.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Using connect-flash to display flash notification in FE
server.use(flash());
server.use(setFlash);

// Set EJS as the view engine
server.set('view engine', 'ejs');

// Set the views directory
server.set('views', './views');

// Route for rendering layout.ejs
server.get('/', (req, res) => {
    // Pass flash messages to the template
    console.log(req.flash());
    res.render('layout', { userName: null, flash: req.flash(), excelData: null });
});

// Mount user routes
server.use('/user', userRouter);

// Apply JWT authentication middleware to all routes except signup and signin
server.use(jwtAuth);

// Mount user routes
server.use('/bandwidth', bandwidthRouter);

// 5. Specify port.
server.listen(8000, () => {
    console.log('Server is running at 8000');
});
