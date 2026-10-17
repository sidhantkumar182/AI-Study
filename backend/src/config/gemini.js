/**
 * src/config/gemini.js
 * Initializes and exports the Google Gemini client.
 *
 * ⚠️  IMPORTANT: Never hardcode your API key.
 *     Set GEMINI_API_KEY in your .env file.
 *     Get your key at: https://aistudio.google.com/app/apikey
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default model — can be overridden per-call
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * Returns a configured Gemini GenerativeModel instance.
 * @param {string} [modelName] - Optional model override
 * @returns {import('@google/generative-ai').GenerativeModel}
 */
const getModel = (modelName = DEFAULT_MODEL) => {
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = { genAI, getModel, DEFAULT_MODEL };
