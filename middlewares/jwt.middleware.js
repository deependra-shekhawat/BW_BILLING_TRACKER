import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
    // 1. Read the token from the cookie
    const token = req.cookies.token;

    //console.log(req.cookies.token);

    // 2. if no token, return the error.
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    // 3. check if token is valid.
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET // Read JWT secret from environment variable
        );
        req.userID = payload.userID;
        next();
    } catch (err) {
        // 4. return error.
        console.error(err);
        return res.status(401).send('Unauthorized');
    }
};

export default jwtAuth;