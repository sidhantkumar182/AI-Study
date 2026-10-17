import { generateContent } from "../services/geminiService.js";

const extractJSON = (text) => {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

const ALLOWED_DIFFICULTIES = ["easy", "medium", "hard"];

export const generateQuiz = async (req, res, next) => {
  try {
    const { difficulty, numberOfQuestions, documentText } = req.body;

    if (!documentText || typeof documentText !== "string" || !documentText.trim()) {
      return res.status(400).json({
        success: false,
        message: "documentText is required",
      });
    }

    const selectedDifficulty = difficulty || "medium";
    if (!ALLOWED_DIFFICULTIES.includes(selectedDifficulty)) {
      return res.status(400).json({
        success: false,
        message: `difficulty must be one of: ${ALLOWED_DIFFICULTIES.join(", ")}`,
      });
    }

    const count = Number(numberOfQuestions) || 10;
    if (!Number.isInteger(count) || count < 1 || count > 50) {
      return res.status(400).json({
        success: false,
        message: "numberOfQuestions must be an integer between 1 and 50",
      });
    }

    const prompt = `You are an AI study assistant. Read the document below and generate ${count} multiple choice questions at ${selectedDifficulty} difficulty. Respond with ONLY a valid JSON object, no markdown formatting, no extra text, in this exact structure:
{
  "questions": [
    {
      "question": "the question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": "the exact text of the correct option",
      "explanation": "brief explanation of the correct answer"
    }
  ]
}

Document:
"""
${documentText}
"""`;

    const raw = await generateContent(prompt);

    let result;
    try {
      result = extractJSON(raw);
    } catch (parseError) {
      const error = new Error("Failed to parse AI response");
      error.statusCode = 502;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
