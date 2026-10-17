/**
 * src/routes/profile.routes.js
 * GET  /api/profile
 * PUT  /api/profile
 * PUT  /api/profile/password
 */

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { updateProfileValidator, changePasswordValidator } = require('../validators/auth.validator');

router.use(protect); // All profile routes require auth

router.get('/',            getProfile);
router.put('/',            updateProfileValidator, validate, updateProfile);
router.put('/password',    changePasswordValidator, validate, changePassword);

module.exports = router;
