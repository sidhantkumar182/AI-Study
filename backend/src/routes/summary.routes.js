/**
 * src/routes/summary.routes.js
 * GET  /api/summary/:pdfId             — Get all generated summaries
 * POST /api/summary/:pdfId/short       — Generate short summary
 * POST /api/summary/:pdfId/bullets     — Generate bullet points
 * POST /api/summary/:pdfId/detailed    — Generate detailed summary
 * POST /api/summary/:pdfId/concepts    — Generate key concepts
 * POST /api/summary/:pdfId/terms       — Generate key terms
 */

const express = require('express');
const router = express.Router();
const {
  getSummary, generateShort, generateBullets,
  generateDetailed, generateConcepts, generateTerms,
} = require('../controllers/summary.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/:pdfId',             getSummary);
router.post('/:pdfId/short',      generateShort);
router.post('/:pdfId/bullets',    generateBullets);
router.post('/:pdfId/detailed',   generateDetailed);
router.post('/:pdfId/concepts',   generateConcepts);
router.post('/:pdfId/terms',      generateTerms);

module.exports = router;
