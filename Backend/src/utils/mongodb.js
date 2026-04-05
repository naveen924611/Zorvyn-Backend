const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI||'mongodb://localhost:27017/finance_tracker');
    }catch(err){
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = {connectDB,mongoose};