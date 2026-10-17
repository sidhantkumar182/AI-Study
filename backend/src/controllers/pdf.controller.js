/**
 * src/controllers/pdf.controller.js
 *
 * POST   /api/pdf          — Upload PDF
 * GET    /api/pdf          — List user's PDFs
 * GET    /api/pdf/:id      — Get PDF details
 * DELETE /api/pdf/:id      — Delete PDF
 */

const asyncHandler = require('express-async-handler');
const path = require('path');
const PDF = require('../models/PDF.model');
const User = require('../models/User.model');
const { extractPDFText } = require('../services/pdf.service');
const { deleteLocalFile, UPLOADS_DIR } = require('../services/upload.service');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');

// ── Upload PDF ────────────────────────────────────────────────────────────────
/**
 * @route   POST /api/pdf
 * @access  Private
 * Multer has already saved the file before this runs.
 * Responds immediately, then processes text extraction asynchronously.
 *
 * Response shape matches the frontend Document type.
 */
const uploadPDF = asyncHandler(async (req, res) => {
  const file = req.file || (req.files && req.files[0]);
  if (!file) return sendBadRequest(res, 'No PDF file uploaded');

  const { title, subject = 'General', tags } = req.body;
  const filePath = file.path;

  // Create DB record in "processing" state
  const pdf = await PDF.create({
    user: req.user._id,
    title: title || file.originalname.replace(/\.pdf$/i, ''),
    originalName: file.originalname,
    filename: file.filename,
    filePath: `uploads/${file.filename}`,
    fileSize: file.size,
    subject,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    status: 'processing',
  });

  // Respond immediately — don't block the upload response on text extraction
  sendCreated(res, {
    message: 'PDF uploaded. Processing in background...',
    data: { document: formatDocument(pdf) },
  });

  // Background: extract text and update record
  try {
    const { text, pageCount, wordCount } = await extractPDFText(filePath);

    await PDF.findByIdAndUpdate(pdf._id, {
      extractedText: text,
      pageCount,
      wordCount,
      status: 'ready',
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.documentsUploaded': 1 },
    });

  } catch (err) {
    await PDF.findByIdAndUpdate(pdf._id, {
      status: 'error',
      processingError: err.message,
    });
    console.error('PDF processing error:', err.message);
  }
});

// ── List PDFs ─────────────────────────────────────────────────────────────────
/**
 * @route   GET /api/pdf
 * @access  Private
 */
const listPDFs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, subject, status } = req.query;
  const filter = { user: req.user._id };
  if (subject) filter.subject = subject;
  if (status) filter.status = status;

  const pdfs = await PDF.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await PDF.countDocuments(filter);

  return sendSuccess(res, {
    message: 'PDFs fetched',
    data: {
      documents: pdfs.map(formatDocument),
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    },
  });
});

// ── Get PDF Details ───────────────────────────────────────────────────────────
/**
 * @route   GET /api/pdf/:id
 * @access  Private
 */
const getPDF = asyncHandler(async (req, res) => {
  const pdf = await PDF.findOne({ _id: req.params.id, user: req.user._id });
  if (!pdf) return sendNotFound(res, 'Document not found');

  return sendSuccess(res, {
    message: 'Document fetched',
    data: { document: formatDocument(pdf) },
  });
});

// ── Delete PDF ─────────────────────────────────────────────────────────────────
/**
 * @route   DELETE /api/pdf/:id
 * @access  Private
 */
const deletePDF = asyncHandler(async (req, res) => {
  const pdf = await PDF.findOne({ _id: req.params.id, user: req.user._id });
  if (!pdf) return sendNotFound(res, 'Document not found');

  // Delete file from disk
  deleteLocalFile(path.join(UPLOADS_DIR, pdf.filename));

  await PDF.deleteOne({ _id: pdf._id });

  return sendSuccess(res, { message: 'Document deleted successfully' });
});

// ── Format helper: maps DB doc to frontend Document shape ────────────────────
const formatDocument = (pdf) => ({
  id: pdf._id.toString(),
  title: pdf.title,
  originalName: pdf.originalName,
  fileSize: pdf.fileSize,
  pageCount: pdf.pageCount,
  wordCount: pdf.wordCount,
  subject: pdf.subject,
  tags: pdf.tags,
  status: pdf.status,
  createdAt: pdf.createdAt,
  updatedAt: pdf.updatedAt,
});

module.exports = { uploadPDF, listPDFs, getPDF, deletePDF };
