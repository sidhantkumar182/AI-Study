import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generateSummary } from "../controllers/summaryController.js";

const router = express.Router();

router.post("/", protect, generateSummary);

export default router;
