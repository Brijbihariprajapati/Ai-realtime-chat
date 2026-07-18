import Message from "../models/Message.js";
import geminiService from "../services/geminiService.js";
import { ROOM_ID } from "./chatController.js";

class AiController {
  suggestReply = async (req, res) => {
    try {
      if (!req.user.isPremium) {
        return res.status(403).json({
          success: false,
          message: "Premium required for AI reply suggestions",
        });
      }

      const messages = await Message.find({ roomId: ROOM_ID })
        .populate("sender", "name")
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      const suggestion = await geminiService.suggestReply(messages.reverse());

      return res.status(200).json({
        success: true,
        data: { suggestion },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to suggest reply",
      });
    }
  };

  summarizeChat = async (req, res) => {
    try {
      if (!req.user.isPremium) {
        return res.status(403).json({
          success: false,
          message: "Premium required for chat summaries",
        });
      }

      const messages = await Message.find({ roomId: ROOM_ID })
        .populate("sender", "name")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      const summary = await geminiService.summarizeChat(
        messages.reverse(),
        req.user._id || req.user.id
      );

      return res.status(200).json({
        success: true,
        data: { summary },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to summarize chat",
      });
    }
  };
}

export default new AiController();
