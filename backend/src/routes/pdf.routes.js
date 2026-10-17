/**
 * src/routes/pdf.routes.js
 * POST   /api/pdf           — Upload (multipart/form-data, field: "pdf")
 * GET    /api/pdf           — List
 * GET    /api/pdf/:id       — Get details
 * DELETE /api/pdf/:id       — Delete
 */

const express = require('express');
const router = express.Router();
const { uploadPDF, listPDFs, getPDF, deletePDF } = require('../controllers/pdf.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../services/upload.service');

router.use(protect);

router.post('/',     upload.any(), uploadPDF);
router.get('/',      listPDFs);
router.get('/:id',   getPDF);
router.delete('/:id', deletePDF);

module.exports = router;
