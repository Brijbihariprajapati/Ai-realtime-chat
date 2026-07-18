"use client";

import { useEffect, useRef } from "react";
import "./MessageList.css";

export default function MessageList({ messages, currentUserId }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="message-list--empty">
        No messages yet. Say hello to the room.
      </div>
    );
  }

  return (
    <div ref={listRef} className="message-list">
      {messages.map((msg) => {
        const mine = String(msg.sender._id) === String(currentUserId);

        return (
          <div
            key={msg._id}
            className={
              "message-list__row " +
              (mine ? "message-list__row--mine" : "message-list__row--other")
            }
          >
            <div
              className={
                "message-list__bubble " +
                (mine
                  ? "message-list__bubble--mine"
                  : "message-list__bubble--other")
              }
            >
              {!mine && (
                <p className="message-list__sender">{msg.sender.name}</p>
              )}
              <p className="message-list__content">{msg.content}</p>
              <p className="message-list__time">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
