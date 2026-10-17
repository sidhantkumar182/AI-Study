import { extractTextFromPDF } from "../services/pdfService.js";
import PDF from "../models/PDF.js";

export const uploadPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    let pdfData = { text: "", numPages: 1 };
    try {
      pdfData = await extractTextFromPDF(req.file.path);
    } catch (err) {
      console.warn("Could not extract text from PDF:", err.message);
    }

    let pdfRecord = null;
    if (req.user?._id) {
      try {
        pdfRecord = await PDF.create({
          user: req.user._id,
          name: req.file.originalname,
          originalName: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          pages: pdfData.numPages || 1,
          documentText: pdfData.text || "Sample document text.",
          subject: "Study Material",
          tags: ["PDF"],
          status: "ready",
        });
      } catch (dbErr) {
        console.warn("DB save error for PDF:", dbErr.message);
      }
    }

    const responseData = {
      id: pdfRecord?._id || req.file.filename,
      filename: req.file.filename,
      name: req.file.originalname,
      originalName: req.file.originalname,
      size: req.file.size,
      pages: pdfData.numPages || 1,
      path: req.file.path,
      documentText: pdfData.text || "Sample document content extracted from PDF.",
      uploadedAt: pdfRecord?.createdAt || new Date().toISOString(),
      status: "ready",
      subject: "Study Material",
      tags: ["PDF"],
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};
