import express from "express";
import protect from "../middleware/authMiddleware.js";
import { chatWithDocument } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protect, chatWithDocument);

export default router;
