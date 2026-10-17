/**
 * src/services/pdf.service.js
 * PDF text extraction using pdf-parse.
 * Keeping this as a separate service makes it easy to swap libraries later.
 */

const pdfParse = require('pdf-parse');
const fs = require('fs');
const { estimateReadingTime } = require('../utils/helpers');

/**
 * Extract text and metadata from a PDF file buffer or path.
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<{
 *   text: string,
 *   pageCount: number,
 *   wordCount: number,
 *   readingTimeMinutes: number,
 *   info: object
 * }>}
 */
const extractPDFText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  const text = data.text || '';
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return {
    text,
    pageCount: data.numpages || 0,
    wordCount,
    readingTimeMinutes: estimateReadingTime(text),
    info: data.info || {},
  };
};

module.exports = { extractPDFText };
