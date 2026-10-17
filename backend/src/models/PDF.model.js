/**
 * src/models/PDF.model.js
 * PDF document metadata schema — matches frontend Document type
 */

const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [255, 'Title too long'],
    },
    originalName: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true, // stored filename on disk (UUID-based)
    },
    filePath: {
      type: String,
      required: true, // relative path: uploads/<filename>
    },
    fileSize: {
      type: Number, // bytes
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    // Extracted text from pdf-parse — used for AI context
    extractedText: {
      type: String,
      default: '',
      select: false, // Don't include by default — large field
    },
    subject: {
      type: String,
      default: 'General',
      trim: true,
    },
    tags: [{ type: String, trim: true }],

    // Processing status
    status: {
      type: String,
      enum: ['processing', 'ready', 'error'],
      default: 'processing',
    },
    processingError: {
      type: String,
      default: null,
    },

    // Storage backend — makes it easy to switch to Cloudinary later
    storageType: {
      type: String,
      enum: ['local', 'cloudinary'],
      default: 'local',
    },
    cloudinaryUrl: {
      type: String,
      default: null,
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
pdfSchema.index({ user: 1, createdAt: -1 });
pdfSchema.index({ user: 1, status: 1 });

const PDF = mongoose.model('PDF', pdfSchema);
module.exports = PDF;
