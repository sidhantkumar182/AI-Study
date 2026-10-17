import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getPDFs, deletePDF } from "../controllers/pdfController.js";

const router = express.Router();

router.get("/", protect, getPDFs);
router.delete("/:id", protect, deletePDF);

export default router;
