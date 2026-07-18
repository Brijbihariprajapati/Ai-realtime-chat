import { Router } from "express";
import paymentController from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const paymentRoutes = Router();

paymentRoutes.post("/create-order", authMiddleware, paymentController.createOrder);
paymentRoutes.post("/verify", authMiddleware, paymentController.verifyPayment);

export default paymentRoutes;
