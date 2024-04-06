import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './features/users/user.route.js';
import jwtAuth from './middlewares/jwt.middleware.js';
import bandwidthRouter from './features/bandwidth/bandwidth.route.js';

// 2. Create Server
const server = express();

// Load all the environment variables in the application
dotenv.config();

server.use(express.json()); // Initialize json middleware
server.use(cookieParser()); // Initialize cookie-parser middleware
server.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
server.set('view engine', 'ejs');

// Set the views directory
server.set('views', './views');

// Route for rendering layout.ejs
server.get('/', (req, res) => {
    // Render layout.ejs with a title
    res.render('layout',{userName: null});
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
