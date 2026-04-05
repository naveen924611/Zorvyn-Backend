
const { getSummary, getRecent , getCategoryBreakdown , getTrends } = require('../controllers/dashboard.controller');

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const express = require('express');
const router = express.Router();

router.get('/dashboard/summary', authenticate, authorize("admin","analyst", "viewer"), getSummary);
router.get('/dashboard/recent', authenticate, authorize("admin","analyst", "viewer"), getRecent);
router.get('/dashboard/category-breakdown', authenticate, authorize("admin","analyst"), getCategoryBreakdown);
router.get('/dashboard/trends', authenticate, authorize("admin","analyst"), getTrends);

module.exports = router;