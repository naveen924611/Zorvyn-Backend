const {getAllUsers ,getUserById , updateStatus , updateUser , deleteUser, createUser} = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const express = require('express');
const router = express.Router();

router.get('/users', authenticate , authorize("admin") , getAllUsers); // done
router.get('/users/:id', authenticate, authorize("admin"), getUserById); // done 
router.post('/users', authenticate, authorize("admin"), createUser); // done
router.put('/users/:id', authenticate, authorize("admin"), updateUser); // done 
router.patch('/users/:id/status', authenticate, authorize("admin"), updateStatus); // done
router.delete('/users/:id', authenticate, authorize("admin"), deleteUser); // done

module.exports = router;