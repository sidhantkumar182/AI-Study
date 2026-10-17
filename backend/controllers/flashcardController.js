import { generateContent } from "../services/geminiService.js";

const extractJSON = (text) => {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentText, numberOfCards } = req.body;

    if (!documentText || typeof documentText !== "string" || !documentText.trim()) {
      return res.status(400).json({
        success: false,
        message: "documentText is required",
      });
    }

    const count = Number(numberOfCards) || 10;
    if (!Number.isInteger(count) || count < 1 || count > 50) {
      return res.status(400).json({
        success: false,
        message: "numberOfCards must be an integer between 1 and 50",
      });
    }

    const prompt = `You are an AI study assistant. Read the document below and generate ${count} flashcards for studying. Respond with ONLY a valid JSON array, no markdown formatting, no extra text, in this exact structure:
[
  {
    "question": "the flashcard question",
    "answer": "the flashcard answer"
  }
]

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
