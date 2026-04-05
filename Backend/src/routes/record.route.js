
const {getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord  } = require('../controllers/record.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const express = require('express');
const router = express.Router();

router.get('/records', authenticate, authorize("admin","analyst", "viewer"), getAllRecords);
router.get('/records/:id', authenticate, authorize("admin","analyst", "viewer"), getRecordById);
router.post('/records', authenticate, authorize("admin"), createRecord);
router.put('/records/:id', authenticate, authorize("admin"), updateRecord);
router.delete('/records/:id', authenticate, authorize("admin"), deleteRecord);

module.exports = router;