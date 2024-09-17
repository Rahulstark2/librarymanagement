require('dotenv').config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    
    
    const authHeader = req.headers.authorization;

    

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.username) {
        req.username = decoded.username;

        next();
        } else {
            return res.status(403).json({});
        }
    } catch (err) {
        console.log(err)
        return res.status(403).json({});
    }
};

module.exports = {
    authMiddleware
}