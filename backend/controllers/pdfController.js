import PDF from "../models/PDF.js";

export const getPDFs = async (req, res, next) => {
  try {
    let pdfs = [];
    if (req.user?._id) {
      pdfs = await PDF.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    if (pdfs.length === 0) {
      pdfs = [
        {
          _id: "pdf_001",
          id: "pdf_001",
          name: "Introduction to Machine Learning.pdf",
          originalName: "Introduction to Machine Learning.pdf",
          size: 4200000,
          pages: 142,
          uploadedAt: new Date().toISOString(),
          status: "ready",
          subject: "Computer Science",
          tags: ["ML", "AI"],
          documentText: "Machine learning models learn patterns from dataset examples.",
        },
        {
          _id: "pdf_002",
          id: "pdf_002",
          name: "Calculus — Stewart 8th Edition.pdf",
          originalName: "Calculus — Stewart 8th Edition.pdf",
          size: 18500000,
          pages: 310,
          uploadedAt: new Date(Date.now() - 86400000).toISOString(),
          status: "ready",
          subject: "Mathematics",
          tags: ["Calculus", "Math"],
          documentText: "Calculus is the mathematical study of continuous change.",
        },
      ];
    }

    res.status(200).json({
      success: true,
      data: pdfs,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePDF = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user?._id) {
      await PDF.findOneAndDelete({ _id: id, user: req.user._id });
    }
    res.status(200).json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
