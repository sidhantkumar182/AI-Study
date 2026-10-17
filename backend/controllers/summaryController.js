import { generateContent } from "../services/geminiService.js";

const extractJSON = (text) => {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
};

export const generateSummary = async (req, res, next) => {
  try {
    const { documentText } = req.body;

    if (!documentText || typeof documentText !== "string" || !documentText.trim()) {
      return res.status(400).json({
        success: false,
        message: "documentText is required",
      });
    }

    const prompt = `You are an AI study assistant. Read the document below and respond with ONLY a valid JSON object, no markdown formatting, no extra text, in this exact structure:
{
  "summary": "a concise paragraph summarizing the document",
  "bulletPoints": ["point 1", "point 2"],
  "keyConcepts": ["concept 1", "concept 2"]
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
