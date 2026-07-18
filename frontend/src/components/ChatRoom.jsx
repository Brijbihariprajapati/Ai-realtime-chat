"use client";

import { useEffect, useState } from "react";
import { getMessages } from "@/lib/api";
import { connectSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import ProfileBar from "./ProfileBar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import PremiumPanel from "./PremiumPanel";
import "./ChatRoom.css";

export default function ChatRoom() {
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const socket = connectSocket();

    getMessages()
      .then((res) => setMessages(res.data || []))
      .catch(() => setToast("Could not load messages"));

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("chat:message", (message) => {
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
    });
    socket.on("premium:unlocked", (payload) => {
      refreshUser();
      setToast(`${payload.name} unlocked Premium`);
    });

    if (socket.connected) setConnected(true);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat:message");
      socket.off("premium:unlocked");
    };
  }, [refreshUser]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const sendMessage = (content) => {
    connectSocket().emit("chat:send", { content });
  };

  return (
    <div className="chat-room">
      <section className="chat-room__main">
        <ProfileBar connected={connected} />
        <MessageList messages={messages} currentUserId={user?.id} />
        <MessageInput
          onSend={sendMessage}
          disabled={!connected}
          draft={draft}
          onDraftChange={setDraft}
        />
      </section>

      <PremiumPanel
        onSuggestion={(text) => {
          setDraft(text);
        }}
        onSummary={() => setToast("Chat summarized")}
      />

      {toast && <div className="chat-room__toast">{toast}</div>}
    </div>
  );
}
