import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generateFlashcards } from "../controllers/flashcardController.js";

const router = express.Router();

router.post("/", protect, generateFlashcards);

export default router;
