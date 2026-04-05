
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const authenticate = async (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: "Unauthorized"});
    }

    const token = authHeader.split(' ')[1];
    try{
        const decoded =  jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
        if(!user){
            return res.status(401).json({message: "Unauthorized"});
        }
        if(user.status === "inactive" ){
            return res.status(403).json({message: "Account is inactive. Please contact support."});
        }
        console.log("Authenticated user:", user.username, "Status:", user.status);
        // console.log("Decoded token:", decoded);
        // console.log("user :", user);
        next();
    }catch(err){
        console.error('Error verifying token:', err);
        return res.status(401).json({message: "Unauthorized"});
    }
}

module.exports = authenticate;