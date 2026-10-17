/**
 * src/utils/helpers.js
 * General-purpose utility functions used across the backend.
 */

const crypto = require('crypto');

/**
 * Generate a short random ID (for quiz question IDs, flashcard IDs, etc.)
 * @param {string} [prefix='id'] - Prefix string
 * @returns {string}
 */
const generateShortId = (prefix = 'id') => {
  return `${prefix}_${crypto.randomBytes(4).toString('hex')}`;
};

/**
 * Truncate text to a maximum number of characters for AI prompts.
 * Gemini has token limits — we cap the text sent to prevent overflows.
 * @param {string} text
 * @param {number} [maxChars=30000]
 * @returns {string}
 */
const truncateText = (text, maxChars = 30000) => {
  if (!text) return '';
  return text.length > maxChars ? text.slice(0, maxChars) + '\n[...document truncated for processing...]' : text;
};

/**
 * Parse Gemini's JSON response safely.
 * Gemini sometimes wraps JSON in markdown code fences — this strips them.
 * @param {string} rawText - Raw text from Gemini
 * @returns {*} Parsed JSON value
 */
const parseGeminiJSON = (rawText) => {
  // Strip markdown code fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return JSON.parse(cleaned);
};

/**
 * Format a conversation history array into a readable string for Gemini.
 * @param {Array<{role: string, content: string}>} messages
 * @returns {string}
 */
const formatConversationHistory = (messages = []) => {
  if (!messages.length) return '';
  return messages
    .slice(-10) // Only send last 10 messages to avoid token overflow
    .map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`)
    .join('\n');
};

/**
 * Calculate estimated reading time in minutes from word count.
 * @param {string} text
 * @returns {number}
 */
const estimateReadingTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200); // average 200 words/min
};

/**
 * Extract file extension from a filename.
 * @param {string} filename
 * @returns {string}
 */
const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Sanitize a filename to remove unsafe characters.
 * @param {string} filename
 * @returns {string}
 */
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

module.exports = {
  generateShortId,
  truncateText,
  parseGeminiJSON,
  formatConversationHistory,
  estimateReadingTime,
  getFileExtension,
  sanitizeFilename,
};
