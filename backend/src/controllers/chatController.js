import Message from "../models/Message.js";

const ROOM_ID = "global";

class ChatController {
  getMessages = async (req, res) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 50, 100);

      const messages = await Message.find({ roomId: ROOM_ID })
        .populate("sender", "name email avatar isPremium")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return res.status(200).json({
        success: true,
        data: messages.reverse(),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch messages",
      });
    }
  };
}

export default new ChatController();
export { ROOM_ID };
