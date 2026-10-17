import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    pages: {
      type: Number,
      default: 1,
    },
    documentText: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      default: "Study Material",
    },
    tags: [String],
    status: {
      type: String,
      enum: ["processing", "ready", "error"],
      default: "ready",
    },
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);
export default PDF;
