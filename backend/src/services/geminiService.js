import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  getModel() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
    });
  }

  formatChat(messages, currentUserId) {
    return messages
      .map((msg) => {
        const senderId = String(msg.sender?._id || msg.sender || "");
        const isYou =
          currentUserId && senderId === String(currentUserId);
        const name = isYou ? "You" : msg.sender?.name || "User";
        return `${name}: ${msg.content}`;
      })
      .join("\n");
  }

  cleanText(text) {
    return String(text || "")
      .replace(/\*\*/g, "")
      .replace(/^\s*[-*]\s+/gm, "• ")
      .trim();
  }

  async suggestReply(messages) {
    try {
      if (!messages?.length) return "Hi! How's everyone doing?";

      const prompt = `Suggest ONE short reply for this chat. Return only the reply.

${this.formatChat(messages.slice(-20))}`;

      const result = await this.getModel().generateContent(prompt);
      return this.cleanText(result.response.text()) || "Tell me more!";
    } catch (error) {
      throw new Error(error.message || "Failed to suggest reply");
    }
  }

  async summarizeChat(messages, currentUserId) {
    try {
      if (!messages?.length) return "No messages to summarize yet.";

      const prompt = `Summarize this chat in 3-5 short bullets for the person reading it.
When referring to messages from "You", write in second person like "You said..." or "You did...".
For other people, use their names like "Alex said..." or "Alex did...".
No markdown stars. Use • for bullets.

${this.formatChat(messages.slice(-50), currentUserId)}`;

      const result = await this.getModel().generateContent(prompt);
      return this.cleanText(result.response.text()) || "Could not summarize.";
    } catch (error) {
      throw new Error(error.message || "Failed to summarize chat");
    }
  }
}

export default new GeminiService();
