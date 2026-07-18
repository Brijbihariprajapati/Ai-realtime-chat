import { Router } from "express";
import chatController from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const chatRoutes = Router();

chatRoutes.get("/messages", authMiddleware, chatController.getMessages);

export default chatRoutes;
