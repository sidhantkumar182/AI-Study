/**
 * src/utils/prompts.js
 * Central repository for all Gemini AI prompt templates.
 * All prompts use function templates for dynamic insertion of context.
 *
 * ❗ Never call Gemini directly in controllers — always go through ai.service.js
 */

const prompts = {

  // ── Chat ────────────────────────────────────────────────────────────────────

  /**
   * Chat with a PDF document. Answers only from the document context.
   * @param {string} documentText - Extracted PDF text
   * @param {string} userQuestion - User's question
   * @param {string} conversationHistory - Formatted prior messages
   */
  chatWithPDF: (documentText, userQuestion, conversationHistory = '') => `
You are an expert, encouraging, and intelligent AI study assistant. A student is asking questions related to an uploaded study document.

DOCUMENT CONTENT:
"""
${documentText}
"""

CONVERSATION HISTORY:
${conversationHistory || 'No prior conversation.'}

STUDENT QUESTION:
${userQuestion}

INSTRUCTIONS:
1. Primary Focus: Use the DOCUMENT CONTENT above as your primary reference to answer the student's question accurately.
2. Contextual Flexibility:
   - If the question directly relates to the document, provide a detailed, clear answer based on the text. Cite relevant sections or terms when helpful.
   - If the question asks for elaboration, real-world examples, or general clarification beyond the exact text, feel free to supplement using general knowledge while clearly indicating what comes from the document vs general context.
   - If the question is a conversational greeting or general study question (e.g., "hi", "how can you help me?", "explain this step-by-step"), respond naturally and helpfully as a study assistant.
   - If information is not in the document but is a study question, answer it helpfully using general knowledge while mentioning that it wasn't explicitly in the uploaded document.
3. Formatting:
   - Use clear formatting with Markdown (headers, bold text, bullet points, code blocks).
   - Keep explanations clear, engaging, structured, and easy to follow.
`.trim(),

  // ── Summary ─────────────────────────────────────────────────────────────────

  /**
   * Generate a short summary (2-3 sentences).
   */
  shortSummary: (text) => `
You are an expert summarizer. Read the following document and generate a concise summary in 2-3 sentences.

DOCUMENT:
"""
${text}
"""

Return ONLY the summary text. No preamble, no labels.
`.trim(),

  /**
   * Generate bullet point takeaways.
   */
  bulletSummary: (text) => `
You are an expert study assistant. Read the following document and extract the most important takeaways as bullet points.

DOCUMENT:
"""
${text}
"""

Return a JSON array of strings. Each string is one key takeaway.
Example: ["First key point", "Second key point", "Third key point"]
Return ONLY valid JSON. No explanation, no markdown code fences.
`.trim(),

  /**
   * Generate a detailed summary (multiple paragraphs).
   */
  detailedSummary: (text) => `
You are an expert academic summarizer. Read the following document and generate a comprehensive, detailed summary.

DOCUMENT:
"""
${text}
"""

Instructions:
- Cover all major topics and subtopics.
- Write in clear, academic language.
- Use paragraphs with smooth transitions.
- Approximately 300-500 words.

Return ONLY the summary text. No preamble.
`.trim(),

  /**
   * Generate key concepts from a document.
   */
  keyConcepts: (text) => `
You are an expert educator. Extract the key concepts from the following document.

DOCUMENT:
"""
${text}
"""

Return a JSON array of objects with this exact shape:
[
  {
    "title": "Concept Name",
    "explanation": "A 2-3 sentence explanation of this concept.",
    "importance": "high" | "medium" | "low"
  }
]

Return ONLY valid JSON. No explanation, no markdown code fences.
`.trim(),

  /**
   * Extract key terms / glossary.
   */
  keyTerms: (text) => `
You are an expert educator. Extract important terms and their definitions from the following document.

DOCUMENT:
"""
${text}
"""

Return a JSON array of objects with this exact shape:
[
  {
    "term": "Term Name",
    "definition": "A clear, concise definition of this term."
  }
]

Return ONLY valid JSON. No explanation, no markdown code fences.
`.trim(),

  // ── Quiz ────────────────────────────────────────────────────────────────────

  /**
   * Generate multiple-choice quiz questions.
   */
  generateQuiz: (text, difficulty, count) => `
You are an expert quiz generator. Generate ${count} multiple-choice questions from the following document.

DOCUMENT:
"""
${text}
"""

Difficulty level: ${difficulty}
- easy: factual recall, straightforward answers
- medium: requires understanding and reasoning
- hard: requires analysis, synthesis, or application

Return a JSON array with this exact shape for each question:
[
  {
    "id": "q1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct.",
    "difficulty": "${difficulty}"
  }
]

Rules:
- correctAnswer is the 0-based index of the correct option in the options array.
- All 4 options must be plausible.
- The explanation must be educational.

Return ONLY valid JSON. No explanation, no markdown code fences.
`.trim(),

  // ── Flashcards ──────────────────────────────────────────────────────────────

  /**
   * Generate flashcards from document.
   */
  generateFlashcards: (text, count = 20) => `
You are an expert educator creating study flashcards. Generate ${count} flashcards from the following document.

DOCUMENT:
"""
${text}
"""

Return a JSON array with this exact shape:
[
  {
    "id": "fc1",
    "front": "Question or term on the front of the card",
    "back": "Answer or definition on the back of the card",
    "difficulty": "easy" | "medium" | "hard"
  }
]

Rules:
- Mix different types: definitions, concept explanations, true/false, fill-in-the-blank style.
- Vary difficulty levels.
- The back should be informative but concise.

Return ONLY valid JSON. No explanation, no markdown code fences.
`.trim(),

};

module.exports = prompts;
