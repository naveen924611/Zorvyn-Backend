

const User = require('../models/user');
const bcrypt = require('bcrypt');
//worked
const getAllUsers = async (req, res) => {
    try{
        const user = await User.find().select('-password');
        if(!user){
            return res.status(200).json({message: "No users found"});
        }
        return res.status(200).json({message: "Users retrieved successfully", data: user});
    }catch(err){
        console.error('Error fetching users:', err);
        return res.status(500).json({message: "Internal server error"});
    }
}
//worked correctly
const getUserById = async (req, res) => {
    const userId = req.user.id;
    try{
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        return res.status(200).json({message: "User retrieved successfully", data: user});
    }catch(err){
        console.error('Error fetching user:', err);
        return res.status(500).json({message: "Internal server error"});
    }

}
//correctly working
const createUser = async (req, res) => {
   const { username, email, password, role = "viewer"} = req.body;
   try{
    // const existingUser = await User.find
      const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashPassword,
        role: role

    })
    const savedUser = await newUser.save().then(user=> user.toObject());
    delete savedUser.password;
    if(!savedUser){
        return res.status(500).json({message: "Failed to create user"});
    }
    return res.status(201).json({message: "User created successfully", data: savedUser});
   }catch(err){
    console.error('Error creating user:', err);
    return res.status(500).json({message: "Internal server error"});
   }
}


//correctly working --> added returnDocument: 'after' , runValidators: true in findByIdAndUpdate to get the updated document and run validators on update
const updateUser = async (req, res) => {
    const deatils = {};
    const userId = req.params.id;
    if(req.body.username){
        deatils.username = req.body.username;
    }
    if(req.body.email){
        deatils.email = req.body.email;
    }
    if(req.body.role){
        deatils.role = req.body.role;
    }

    try{
        const updateUser = await User.findByIdAndUpdate(userId, deatils, {returnDocument: 'after' , runValidators: true}).then(user => user.toObject());
            delete updateUser.password;
        if(!updateUser){
            return res.status(404).json({message: "User not found"});
        }
        // return res.status(200).json({message: "User updated successfully", data: updateUser});
        return res.status(200).json({message: "User updated successfully" });

    }catch(err){
        console.error('Error updating user:', err);
        return res.status(500).json({message: "Internal server error"});
    }

}
// correctly
const updateStatus = async (req, res) => {
   const userId = req.params.id;
    const {status} = req.body;

    // const validStatuses = ["active", "inactive"];
    // if(!validStatuses.includes(status)){
    //     return res.status(400).json({message: "Invalid status value. Must be 'active' or 'inactive'"});
    // }
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        user.status = status;
        const updatedUser = await user.save().then(user => user.toObject());
        delete updatedUser.password;
        // return res.status(200).json({message: "User status updated successfully", data: updatedUser});
        return res.status(200).json({message: "User status updated successfully"});
    }catch(err){
        console.error('Error updating user status:', err);
        return res.status(500).json({message: "Internal server error"});
    }   
}
const deleteUser = async (req, res) => {
   const userId = req.params.id;
   try{
            const user = await User.findByIdAndDelete(userId);
            if(!user){
                return res.status(404).json({message: "User not found"});
            }
            return res.status(200).json({message: "User deleted successfully"});
   }catch(err){
        console.error('Error deleting user:', err);
        return res.status(500).json({message: "Internal server error"});
   }
}

module.exports = {getAllUsers, getUserById, createUser, updateUser, updateStatus, deleteUser};