/**
 * src/services/upload.service.js
 * Multer configuration for PDF uploads.
 *
 * Currently stores to local disk (uploads/).
 * To switch to Cloudinary later:
 *   - Install multer-storage-cloudinary
 *   - Replace diskStorage with cloudinaryStorage
 *   - No controller changes needed — just swap this service.
 */

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ── Disk Storage ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // UUID-based filename to prevent collisions and path traversal
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

// ── File Filter: only PDFs ───────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Only PDF files are allowed.');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// ── Size Limit ───────────────────────────────────────────────────────────────
const MAX_FILE_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 50) * 1024 * 1024;

// ── Upload Middleware ─────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * Delete a file from local disk.
 * @param {string} filePath - Absolute or relative path to the file
 */
const deleteLocalFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Failed to delete file:', err.message);
  }
};

module.exports = { upload, deleteLocalFile, UPLOADS_DIR };
