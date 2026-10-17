import { generateContent } from "../services/geminiService.js";

export const chatWithDocument = async (req, res, next) => {
  try {
    const { message, documentText } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    if (!documentText || typeof documentText !== "string" || !documentText.trim()) {
      return res.status(400).json({
        success: false,
        message: "documentText is required",
      });
    }

    const prompt = `You are an AI study assistant. Answer the user's question using only the information in the document below. If the answer is not present in the document, say so clearly.

Document:
"""
${documentText}
"""

Question: ${message}`;

    const answer = await generateContent(prompt);

    res.status(200).json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    next(error);
  }
};
