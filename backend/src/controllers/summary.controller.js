/**
 * src/controllers/summary.controller.js
 *
 * GET  /api/summary/:pdfId             — Get existing summary
 * POST /api/summary/:pdfId/short       — Generate short summary
 * POST /api/summary/:pdfId/bullets     — Generate bullet points
 * POST /api/summary/:pdfId/detailed    — Generate detailed summary
 * POST /api/summary/:pdfId/concepts    — Generate key concepts
 * POST /api/summary/:pdfId/terms       — Generate key terms
 */

const asyncHandler = require('express-async-handler');
const Summary = require('../models/Summary.model');
const PDF = require('../models/PDF.model');
const aiService = require('../services/ai.service');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');

// ── Helper: get PDF with extracted text, verify ownership ────────────────────
const getPDFWithText = async (pdfId, userId) => {
  const pdf = await PDF.findOne({ _id: pdfId, user: userId }).select('+extractedText');
  return pdf;
};

// ── Helper: get or create summary doc for a PDF ──────────────────────────────
const getOrCreateSummary = async (pdfId, userId) => {
  let summary = await Summary.findOne({ pdf: pdfId, user: userId });
  if (!summary) {
    summary = await Summary.create({ pdf: pdfId, user: userId });
  }
  return summary;
};

// ── Get Summary ────────────────────────────────────────────────────────────────
/**
 * @route   GET /api/summary/:pdfId
 * @access  Private
 * Returns all generated summary sections for a PDF.
 * Shape matches frontend SummaryData type.
 */
const getSummary = asyncHandler(async (req, res) => {
  const { pdfId } = req.params;
  const pdf = await PDF.findOne({ _id: pdfId, user: req.user._id });
  if (!pdf) return sendNotFound(res, 'Document not found');

  const summary = await Summary.findOne({ pdf: pdfId, user: req.user._id });

  return sendSuccess(res, {
    message: 'Summary fetched',
    data: { summary: formatSummary(summary, pdf) },
  });
});

// ── Generate Short Summary ────────────────────────────────────────────────────
/** @route POST /api/summary/:pdfId/short */
const generateShort = asyncHandler(async (req, res) => {
  const pdf = await getPDFWithText(req.params.pdfId, req.user._id);
  if (!pdf) return sendNotFound(res, 'Document not found');
  if (pdf.status !== 'ready') return sendBadRequest(res, 'Document is still being processed');

  const text = await aiService.generateShortSummary(pdf.extractedText);
  const summary = await getOrCreateSummary(pdf._id, req.user._id);

  summary.shortSummary = text;
  summary.generated.short = true;
  await summary.save();

  return sendSuccess(res, {
    message: 'Short summary generated',
    data: { shortSummary: text },
  });
});

// ── Generate Bullet Points ────────────────────────────────────────────────────
/** @route POST /api/summary/:pdfId/bullets */
const generateBullets = asyncHandler(async (req, res) => {
  const pdf = await getPDFWithText(req.params.pdfId, req.user._id);
  if (!pdf) return sendNotFound(res, 'Document not found');
  if (pdf.status !== 'ready') return sendBadRequest(res, 'Document is still being processed');

  const bullets = await aiService.generateBulletSummary(pdf.extractedText);
  const summary = await getOrCreateSummary(pdf._id, req.user._id);

  summary.bulletPoints = bullets;
  summary.generated.bullets = true;
  await summary.save();

  return sendSuccess(res, {
    message: 'Bullet summary generated',
    data: { bulletPoints: bullets },
  });
});

// ── Generate Detailed Summary ─────────────────────────────────────────────────
/** @route POST /api/summary/:pdfId/detailed */
const generateDetailed = asyncHandler(async (req, res) => {
  const pdf = await getPDFWithText(req.params.pdfId, req.user._id);
  if (!pdf) return sendNotFound(res, 'Document not found');
  if (pdf.status !== 'ready') return sendBadRequest(res, 'Document is still being processed');

  const text = await aiService.generateDetailedSummary(pdf.extractedText);
  const summary = await getOrCreateSummary(pdf._id, req.user._id);

  summary.detailedSummary = text;
  summary.generated.detailed = true;
  await summary.save();

  return sendSuccess(res, {
    message: 'Detailed summary generated',
    data: { detailedSummary: text },
  });
});

// ── Generate Key Concepts ─────────────────────────────────────────────────────
/** @route POST /api/summary/:pdfId/concepts */
const generateConcepts = asyncHandler(async (req, res) => {
  const pdf = await getPDFWithText(req.params.pdfId, req.user._id);
  if (!pdf) return sendNotFound(res, 'Document not found');
  if (pdf.status !== 'ready') return sendBadRequest(res, 'Document is still being processed');

  const concepts = await aiService.generateKeyConcepts(pdf.extractedText);
  const summary = await getOrCreateSummary(pdf._id, req.user._id);

  summary.keyConcepts = concepts;
  summary.generated.concepts = true;
  await summary.save();

  return sendSuccess(res, {
    message: 'Key concepts generated',
    data: { keyConcepts: concepts },
  });
});

// ── Generate Key Terms ────────────────────────────────────────────────────────
/** @route POST /api/summary/:pdfId/terms */
const generateTerms = asyncHandler(async (req, res) => {
  const pdf = await getPDFWithText(req.params.pdfId, req.user._id);
  if (!pdf) return sendNotFound(res, 'Document not found');
  if (pdf.status !== 'ready') return sendBadRequest(res, 'Document is still being processed');

  const terms = await aiService.generateKeyTerms(pdf.extractedText);
  const summary = await getOrCreateSummary(pdf._id, req.user._id);

  summary.keyTerms = terms;
  summary.generated.terms = true;
  await summary.save();

  return sendSuccess(res, {
    message: 'Key terms generated',
    data: { keyTerms: terms },
  });
});

// ── Format helper: matches frontend SummaryData shape ────────────────────────
const formatSummary = (summary, pdf) => ({
  id: summary?._id?.toString() || null,
  pdfId: pdf._id.toString(),
  pdfTitle: pdf.title,
  shortSummary: summary?.shortSummary || null,
  bulletPoints: summary?.bulletPoints || [],
  detailedSummary: summary?.detailedSummary || null,
  keyConcepts: summary?.keyConcepts || [],
  keyTerms: summary?.keyTerms || [],
  generated: summary?.generated || {},
  updatedAt: summary?.updatedAt || null,
});

module.exports = {
  getSummary,
  generateShort,
  generateBullets,
  generateDetailed,
  generateConcepts,
  generateTerms,
};
