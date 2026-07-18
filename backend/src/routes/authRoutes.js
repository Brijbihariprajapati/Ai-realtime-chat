import { Router } from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRoutes = Router();

authRoutes.get("/google", authController.googleLogin);
authRoutes.get("/google/callback", authController.googleCallback);
authRoutes.get("/me", authMiddleware, authController.me);

export default authRoutes;
