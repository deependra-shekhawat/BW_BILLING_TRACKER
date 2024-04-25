import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
    // 1. Read the token from the cookie
    const token = req.cookies.token;

    //console.log(req.cookies.token);

    // 2. if no token, return the error.
    if (!token) {
        return res.status(401).send('Unauthorized, First Login to access this page');
    }

    // 3. check if token is valid.
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET // Read JWT secret from environment variable
        );
        
        // Check if the token is about to expire in less than 10 minutes
        const now = Math.floor(Date.now() / 1000);
        const tokenExp = payload.exp;
        const timeDiff = tokenExp - now;
        const fifteenMinutesInSeconds = 10 * 60;
        if (timeDiff < fifteenMinutesInSeconds) {
            // Generate a new token with an extended expiration time
            const newToken = jwt.sign({ user: payload.user.user }, process.env.JWT_SECRET, { expiresIn: '15m' });
            
            // Set the new token in the response cookien
            res.cookie('token', newToken, { httpOnly: true });
        }

        req.user = payload.user.user;
        //console.log(req.user);
        next();
    } catch (err) {
        // 4. return error.
        console.error(err);
        return res.status(401).send('Unauthorized');
    }
};

export default jwtAuth;
