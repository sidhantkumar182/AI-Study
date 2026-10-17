import fs from "fs";
import pdfParse from "pdf-parse";

export const extractTextFromPDF = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    const error = new Error("PDF file not found");
    error.statusCode = 404;
    throw error;
  }

  const dataBuffer = fs.readFileSync(filePath);
  const parsed = await pdfParse(dataBuffer);

  const text = parsed.text?.trim();

  if (!text) {
    const error = new Error("No readable text found in PDF");
    error.statusCode = 422;
    throw error;
  }

  return {
    text,
    numPages: parsed.numpages,
    info: parsed.info,
  };
};
