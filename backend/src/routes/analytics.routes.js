/**
 * src/routes/analytics.routes.js
 */

const express = require('express');
const router = express.Router();
const { getDashboard, getOverview, logActivity } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/dashboard',     getDashboard);
router.get('/overview',      getOverview);
router.post('/activity',     logActivity);

module.exports = router;
