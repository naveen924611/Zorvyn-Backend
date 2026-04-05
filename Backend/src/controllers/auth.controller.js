
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const register = async(req, res)=>{
    const {username , email, password} = req.body;
    try{
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        
            const newUser = new User({
                username,
                email,
                password: hashPassword,
                // role: req.body.role? req.body.role : "viewer"
            });
      

          const savedUser = await newUser.save().then(user => user.toObject());
          delete savedUser.password;

        //   const token = jwt.sign({id: savedUser._id, role: savedUser.role ,status : savedUser.status}, JWT_SECRET, {expiresIn: '1h'});
          const token = jwt.sign({id: savedUser._id , status : savedUser.status}, JWT_SECRET, {expiresIn: '1h'});
         

          if(savedUser){
        // return res.status(201).json({message: "User registered successfully", token , savedUser});
         return res.status(200).json({success : true ,message: "Login successful", data:{token, user: savedUser}});
          } else{
            return res.status(500).json({message: "Failed to register user"});
          }
    }catch(err){
        console.error('Error during registration:', err);
        return res.status(500).json({message: "Internal server error"});
    }

}

const login = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }
        // const token =  jwt.sign({id: user._id, role: user.role , status: user.status}, JWT_SECRET, {expiresIn: '1h'});
        const token =  jwt.sign({id: user._id , status: user.status}, JWT_SECRET, {expiresIn: '15m'});
        
        // delete user.password; 
       const user1 = user.toObject();
        delete user1.password;

        return res.status(200).json({success : true ,message: "Login successful", data:{token, user: user1}});


    }catch(err){
        console.error('Error during login:', err);
        return res.status(500).json({message: "Internal server error"});
    }
};

module.exports = {register, login};