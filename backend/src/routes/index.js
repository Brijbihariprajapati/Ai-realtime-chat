import { Router } from "express";
import authRoutes from "./authRoutes.js";
import chatRoutes from "./chatRoutes.js";
import aiRoutes from "./aiRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/ai", aiRoutes);
router.use("/payment", paymentRoutes);

export default router;
