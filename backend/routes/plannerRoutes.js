import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/plannerController.js";

const router = express.Router();

router.get("/tasks", protect, getTasks);
router.post("/tasks", protect, createTask);
router.patch("/tasks/:id", protect, updateTask);
router.delete("/tasks/:id", protect, deleteTask);

export default router;
