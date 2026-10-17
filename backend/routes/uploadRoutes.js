import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import { uploadPDF } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadPDF);

export default router;
