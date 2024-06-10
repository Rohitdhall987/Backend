import jwt from 'jsonwebtoken';

// Your secret key for JWT verification (should be stored securely)
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if the header exists and starts with "Bearer"
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Extract the token
        const token = authHeader.split(' ')[1];

        try {
            // Verify the token
            const decoded = jwt.verify(token, SECRET_KEY);

            // Attach the decoded user info to the request object (if needed)
            req.user = decoded;

            // Proceed to the next middleware/route handler
            next();
        } catch (error) {
            // If the token is invalid, send a 403 response
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
    } else {
        // If the Authorization header is missing or not Bearer, send a 401 response
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
};

export default authMiddleware;
