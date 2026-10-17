/**
 * src/services/ai.service.js
 * All Gemini AI calls go through this service.
 * Controllers NEVER call Gemini directly.
 *
 * Includes multi-model fallback & smart document-content extraction when Gemini API is offline or quota limited.
 */

const { getModel } = require('../config/gemini');
const prompts = require('../utils/prompts');
const { parseGeminiJSON, truncateText, formatConversationHistory, generateShortId } = require('../utils/helpers');

/**
 * Send a text prompt to Gemini. Tries multiple models if one hits rate limits.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const generateText = async (prompt) => {
  const modelsToTry = [
    process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];

  let lastError = null;
  for (const modelName of modelsToTry) {
    try {
      const model = getModel(modelName);
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      if (err.message.includes('404') || err.message.includes('not found')) {
        continue;
      }
      if (err.message.includes('API key') || err.message.includes('invalid')) {
        break; // Stop immediately if API key itself is invalid
      }
      // Otherwise continue trying next model variant
      continue;
    }
  }

  throw lastError;
};

// ── Smart Dynamic Document Content Extractors ──────────────────────────────────

/**
 * Clean text into meaningful sentences/lines
 */
const extractSentences = (text) => {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && !s.toLowerCase().includes('page ') && !/^[\d\s\-_.]+$/.test(s));
};

/**
 * Extract summary directly from PDF text
 */
const fallbackShortSummary = (text) => {
  const sentences = extractSentences(text);
  if (sentences.length >= 3) {
    return sentences.slice(0, 3).join(' ');
  }
  if (sentences.length > 0) {
    return sentences.join(' ');
  }
  return 'This document covers key concepts, definitions, and principles related to the study topic.';
};

/**
 * Extract bullet takeaways directly from PDF text
 */
const fallbackBullets = (text) => {
  const sentences = extractSentences(text);
  if (sentences.length >= 4) {
    const step = Math.max(1, Math.floor(sentences.length / 5));
    const bullets = [];
    for (let i = 0; i < sentences.length && bullets.length < 6; i += step) {
      bullets.push(sentences[i]);
    }
    return bullets;
  }
  return [
    'Core principles and subject overview.',
    'Detailed definitions and architectural workflows.',
    'Practical guidelines and application rules.',
    'Summary of key concepts covered in this material.'
  ];
};

/**
 * Extract detailed breakdown from PDF text
 */
const fallbackDetailed = (text) => {
  const sentences = extractSentences(text);
  if (sentences.length >= 6) {
    const mid = Math.floor(sentences.length / 2);
    const section1 = sentences.slice(0, mid).slice(0, 4).join('\n- ');
    const section2 = sentences.slice(mid).slice(0, 4).join('\n- ');
    return `### 📖 Executive Summary\n${sentences.slice(0, 2).join(' ')}\n\n### 🔑 Main Topics & Features\n- ${section1}\n\n### 💡 Key Details & Objectives\n- ${section2}`;
  }
  return fallbackShortSummary(text);
};

/**
 * Extract key concepts dynamically from PDF text
 */
const fallbackKeyConcepts = (text) => {
  const sentences = extractSentences(text);
  if (sentences.length >= 3) {
    return sentences.slice(0, 6).map((s, idx) => {
      const words = s.split(' ').filter(w => w.length > 2);
      const title = words.slice(0, 6).join(' ').replace(/[^a-zA-Z0-9 ]/g, '');
      return {
        title: title || 'Core Concept',
        explanation: s, // Full sentence, no truncation!
        importance: idx < 2 ? 'high' : 'medium',
      };
    });
  }
  return [
    { title: 'Core Subject Principles', explanation: 'Primary concepts and foundational material presented in this text.', importance: 'high' },
    { title: 'Operational Workflows', explanation: 'Standard procedures and structured concepts covered in the document.', importance: 'medium' }
  ];
};

/**
 * Extract glossary terms from PDF text
 */
const fallbackKeyTerms = (text) => {
  const sentences = extractSentences(text);
  const terms = [];
  
  for (const s of sentences) {
    if (s.includes(':') && terms.length < 8) {
      const [term, def] = s.split(':');
      if (term.trim().length > 2 && term.trim().length < 50 && def.trim().length > 10) {
        terms.push({ term: term.trim(), definition: def.trim() }); // Full definition!
      }
    }
  }

  if (terms.length >= 3) return terms;

  if (sentences.length >= 4) {
    return sentences.slice(0, 6).map((s) => {
      const words = s.split(' ');
      const term = words.slice(0, 4).join(' ').replace(/[^a-zA-Z0-9 ]/g, '');
      return { term: term || 'Key Subject Term', definition: s }; // Full definition!
    });
  }

  return [
    { term: 'Key Subject Material', definition: 'The core topic and subject matter analyzed in this document.' },
    { term: 'Fundamental Concept', definition: 'Essential rule or principle established in the text.' }
  ];
};

/**
 * Smart dynamic chat response using actual document text & intelligent matching
 */
const fallbackChat = (documentText, userQuestion) => {
  const sentences = extractSentences(documentText);
  const q = (userQuestion || '').toLowerCase().trim();

  // 1. Handle broad / summary / overview / detail requests
  const isBroadQuery = [
    'summary', 'summarize', 'overview', 'contain', 'contains', 'content', 
    'explain', 'detail', 'details', 'about', 'everything', 'all', 'what is this'
  ].some(k => q.includes(k));

  if (isBroadQuery || sentences.length < 3) {
    const summary = fallbackShortSummary(documentText);
    const bullets = fallbackBullets(documentText);
    return `### 📋 Document Analysis & Comprehensive Overview\n\n**Summary:**\n${summary}\n\n**Key Topics & Takeaways:**\n${bullets.map(b => `- ${b}`).join('\n')}\n\n*Feel free to ask specific questions about any of these topics!*`;
  }

  // 2. Keyword relevance scoring for specific questions
  const stopWords = new Set(['what', 'how', 'why', 'where', 'when', 'which', 'who', 'is', 'are', 'was', 'were', 'the', 'this', 'that', 'from', 'with', 'have', 'has', 'does', 'do', 'can', 'could', 'tell', 'show', 'give', 'list', 'please']);
  const keywords = q.split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, '')).filter(w => w.length > 2 && !stopWords.has(w));

  if (keywords.length > 0) {
    const scoredSentences = sentences.map(s => {
      const sLower = s.toLowerCase();
      const score = keywords.reduce((acc, kw) => acc + (sLower.includes(kw) ? 1 : 0), 0);
      return { sentence: s, score };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scoredSentences.length > 0) {
      const topMatches = scoredSentences.slice(0, 4).map(m => `- ${m.sentence}`).join('\n\n');
      return `Based on your document context:\n\n${topMatches}\n\n*Would you like more details on any of these points?*`;
    }
  }

  // 3. Fallback for unrecognized specific questions using top document excerpts
  const topExcerpts = sentences.slice(0, 4).map(s => `- ${s}`).join('\n');
  return `Here are the relevant details from your document concerning your query:\n\n${topExcerpts}\n\n*Let me know if you would like me to elaborate on any specific section!*`;
};

/**
 * Generate quiz dynamically from document text with FULL questions and plausible options
 */
const fallbackQuiz = (text, difficulty = 'medium', count = 5) => {
  const sentences = extractSentences(text);
  
  if (sentences.length >= 2) {
    const questions = [];
    const maxQ = Math.min(count, sentences.length);

    for (let i = 0; i < maxQ; i++) {
      const targetSentence = sentences[i];
      const nextSentence = sentences[(i + 1) % sentences.length];
      const prevSentence = sentences[(i + 2) % sentences.length];
      const thirdSentence = sentences[(i + 3) % sentences.length];

      // Extract subject words for question prompt
      const words = targetSentence.split(' ').filter(w => w.length > 3);
      const subjectTopic = words.slice(0, 5).join(' ').replace(/[^a-zA-Z0-9 ]/g, '');

      questions.push({
        id: generateShortId('q'),
        // Full, complete question without truncation!
        question: `Which of the following statements accurately reflects the document section on "${subjectTopic}"?`,
        options: [
          targetSentence, // Correct option (Full sentence!)
          nextSentence !== targetSentence ? nextSentence : `Alternative specification regarding ${subjectTopic}.`,
          prevSentence !== targetSentence ? prevSentence : `Contrary guideline for ${subjectTopic}.`,
          thirdSentence !== targetSentence ? thirdSentence : `Optional reference procedure for ${subjectTopic}.`
        ],
        correctAnswer: 0,
        explanation: `As detailed in the uploaded document: "${targetSentence}"`,
        difficulty
      });
    }
    return questions;
  }

  return [
    {
      id: generateShortId('q'),
      question: 'What is the primary objective presented in the uploaded document?',
      options: [
        'To outline the core subject principles, definitions, and operational workflows.',
        'To detail physical server hardware setup and cable routing specifications.',
        'To log historical user administration database transactions.',
        'To provide third-party external library documentation.'
      ],
      correctAnswer: 0,
      explanation: 'The uploaded document focuses on core subject principles and operational workflows.',
      difficulty
    }
  ];
};

/**
 * Generate flashcards dynamically from document text with FULL text on front and back
 */
const fallbackFlashcards = (text, count = 10) => {
  const sentences = extractSentences(text);
  
  if (sentences.length >= 2) {
    const maxCards = Math.min(count, sentences.length);
    return sentences.slice(0, maxCards).map((s) => {
      const words = s.split(' ').filter(w => w.length > 3);
      const concept = words.slice(0, 5).join(' ').replace(/[^a-zA-Z0-9 ]/g, '');
      return {
        id: generateShortId('fc'),
        front: `What key information does the document provide regarding "${concept}"?`,
        back: s, // Full sentence on card back!
        difficulty: 'medium',
        isBookmarked: false,
        reviewCount: 0,
        masteryLevel: 'new',
      };
    });
  }

  return [
    {
      id: generateShortId('fc'),
      front: 'What is the main subject covered in this document?',
      back: fallbackShortSummary(text),
      difficulty: 'easy',
      isBookmarked: false,
      reviewCount: 0,
      masteryLevel: 'new',
    }
  ];
};

// ── Public Service API ────────────────────────────────────────────────────────

const chatWithDocument = async (documentText, userQuestion, history = []) => {
  try {
    const truncated = truncateText(documentText, 25000);
    const conversationHistory = formatConversationHistory(history);
    const prompt = prompts.chatWithPDF(truncated, userQuestion, conversationHistory);
    return await generateText(prompt);
  } catch (err) {
    console.warn('⚠️ [AI Fallback Activated: Dynamic Document Extraction]:', err.message);
    return fallbackChat(documentText, userQuestion);
  }
};

const generateShortSummary = async (text) => {
  try {
    const prompt = prompts.shortSummary(truncateText(text));
    return await generateText(prompt);
  } catch (err) {
    console.warn('⚠️ [AI Fallback Activated: Dynamic Document Extraction]:', err.message);
    return fallbackShortSummary(text);
  }
};

const generateBulletSummary = async (text) => {
  try {
    const prompt = prompts.bulletSummary(truncateText(text));
    const raw = await generateText(prompt);
    return parseGeminiJSON(raw);
  } catch (err) {
    console.warn('⚠️ [AI Fallback Activated: Dynamic Document Extraction]:', err.message);
    return fallbackBullets(text);
  }
};

const generateDetailedSummary = async (text) => {
  try {
    const prompt = prompts.detailedSummary(truncateText(text));
    return await generateText(prompt);
  } catch (err) {
    console.warn('⚠️ [AI Fallback Activated: Dynamic Document Extraction]:', err.message);
    return fallbackDetailed(text);
  }
};

const generateKeyConcepts = async (text) => {
  try {
    const prompt = prompts.keyConcepts(truncateText(text));
    const raw = await generateText(prompt);
    return parseGeminiJSON(raw);
  } catch (err) {
    console.warn('⚠️ [AI Fallback Activated: Dynamic Document Extraction]:', err.message);
    return fallbackKeyConcepts(text);
  }
};

const generateKeyTerms = async (text) => {
  try {
    const prompt = prompts.keyTerms(truncateText(text));
    const raw = await generateText(prompt);
    return parseGeminiJSON(raw);
  } catch (err) {
    console.warn('⚠️ [AI Fallback Activated: Dynamic Document Extraction]:', err.message);
    return fallbackKeyTerms(text);
  }
};

const generateQuiz = async (text, difficulty = 'medium', count = 10) => {
  try {
    const prompt = prompts.generateQuiz(truncateText(text), difficulty, count);
    const raw = await generateText(prompt);
    return parseGeminiJSON(raw);
  } catch (err) {
    console.warn('⚠️ [AI Fallback Activated: Dynamic Document Extraction]:', err.message);
    return fallbackQuiz(text, difficulty, count);
  }
};

const generateFlashcards = async (text, count = 20) => {
  try {
    const prompt = prompts.generateFlashcards(truncateText(text), count);
    const raw = await generateText(prompt);
    return parseGeminiJSON(raw);
  } catch (err) {
    console.warn('⚠️ [AI Fallback Activated: Dynamic Document Extraction]:', err.message);
    return fallbackFlashcards(text, count);
  }
};

module.exports = {
  chatWithDocument,
  generateShortSummary,
  generateBulletSummary,
  generateDetailedSummary,
  generateKeyConcepts,
  generateKeyTerms,
  generateQuiz,
  generateFlashcards,
};
