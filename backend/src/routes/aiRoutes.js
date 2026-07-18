import { Router } from "express";
import aiController from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const aiRoutes = Router();

aiRoutes.post("/suggest-reply", authMiddleware, aiController.suggestReply);
aiRoutes.post("/summarize", authMiddleware, aiController.summarizeChat);

export default aiRoutes;
