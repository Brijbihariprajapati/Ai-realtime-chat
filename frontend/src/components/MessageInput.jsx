"use client";

import { useState } from "react";
import "./MessageInput.css";

export default function MessageInput({
  onSend,
  disabled,
  draft = "",
  onDraftChange,
}) {
  const [text, setText] = useState("");
  const value = onDraftChange ? draft : text;

  const setValue = (next) => {
    if (onDraftChange) onDraftChange(next);
    else setText(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = value.trim();
    if (!content || disabled) return;
    setValue("");
    onSend(content);
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write a message…"
        disabled={disabled}
        maxLength={2000}
        className="message-input__field"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="message-input__send"
      >
        Send
      </button>
    </form>
  );
}
