import tokenService from "../services/tokenService.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { ROOM_ID } from "../controllers/chatController.js";
import { setIO } from "./io.js";

const registerSocketHandlers = (io) => {
  setIO(io);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = tokenService.verifyToken(token);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(ROOM_ID);

    socket.on("chat:send", async (payload) => {
      try {
        const content = String(payload?.content || "").trim();
        if (!content) return;

        const message = await Message.create({
          roomId: ROOM_ID,
          sender: socket.user._id,
          content,
        });

        await message.populate("sender", "name email avatar isPremium");

        io.to(ROOM_ID).emit("chat:message", {
          _id: message._id,
          roomId: message.roomId,
          content: message.content,
          createdAt: message.createdAt,
          sender: {
            _id: message.sender._id.toString(),
            name: message.sender.name,
            email: message.sender.email,
            avatar: message.sender.avatar,
            isPremium: message.sender.isPremium,
          },
        });
      } catch (error) {
        console.error("chat:send error:", error.message);
      }
    });
  });
};

export default registerSocketHandlers;
