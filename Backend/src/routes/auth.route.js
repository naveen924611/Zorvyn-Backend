// const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

//controllers

const {register , login } = require('../controllers/auth.controller');
//Login route 
router.post('/login', login);
router.post('/register', register);
router.post('/test', authenticate , authorize("viewer", "editor", "admin"), (req, res)=>{
    res.status(200).json({message: "Test successful. You have admin access."});
});

module.exports = router;