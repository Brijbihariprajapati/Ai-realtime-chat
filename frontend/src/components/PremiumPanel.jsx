"use client";

import { useState } from "react";
import {
  createPaymentOrder,
  verifyPayment,
  suggestReply,
  summarizeChat,
} from "@/lib/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { useAuthStore } from "@/store/authStore";
import "./PremiumPanel.css";

const AMOUNT = Number(process.env.NEXT_PUBLIC_PREMIUM_AMOUNT_INR) || 49;

export default function PremiumPanel({ onSuggestion, onSummary }) {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  const runSuggest = async () => {
    setError("");
    setBusy("suggest");
    try {
      const res = await suggestReply();
      onSuggestion(res.data?.suggestion || "");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Suggest failed");
    } finally {
      setBusy(null);
    }
  };

  const runSummarize = async () => {
    setError("");
    setBusy("summarize");
    try {
      const res = await summarizeChat();
      const text = res.data?.summary || "";
      setSummary(text);
      onSummary(text);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Summarize failed");
    } finally {
      setBusy(null);
    }
  };

  const unlockPremium = async () => {
    setError("");
    setBusy("pay");
    try {
      const res = await createPaymentOrder();
      const order = res.data;
      if (!order) throw new Error("Order not created");

      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Deft Premium",
        description: `Premium unlock — ₹${order.amountInr || AMOUNT}`,
        order_id: order.orderId,
        prefill: {
          name: order.user.name,
          email: order.user.email,
        },
        theme: { color: "#0f3d3e" },
        modal: {
          ondismiss: () => setBusy(null),
        },
        handler: async (response) => {
          try {
            const verified = await verifyPayment(response);
            if (verified.data) updateUser(verified.data);
          } catch (verifyErr) {
            setError(
              verifyErr.response?.data?.message ||
                verifyErr.message ||
                "Verification failed"
            );
          } finally {
            setBusy(null);
          }
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment failed");
      setBusy(null);
    }
  };

  return (
    <aside className="premium-panel">
      <div>
        <h2 className="premium-panel__title">Premium</h2>
        <p className="premium-panel__desc">
          {user?.isPremium
            ? "Use AI tools to suggest a reply or summarize this chat."
            : "Get AI Suggest reply and Summarize chat after unlocking Premium."}
        </p>
      </div>

      {!user?.isPremium ? (
        <div className="premium-panel__card">
          <p className="premium-panel__card-title">Go Premium</p>
          <p className="premium-panel__card-desc">
            Unlock Suggest reply and Summarize chat. Pay once — AI tools unlock
            instantly.
          </p>
          <p className="premium-panel__price">₹{AMOUNT}</p>
          <button
            type="button"
            onClick={unlockPremium}
            disabled={!!busy}
            className="premium-panel__pay"
          >
            {busy === "pay" ? "Opening checkout…" : `Pay ₹${AMOUNT}`}
          </button>
        </div>
      ) : (
        <div className="premium-panel__actions">
          <button
            type="button"
            onClick={runSuggest}
            disabled={!!busy}
            className="premium-panel__action"
          >
            {busy === "suggest" ? "Thinking…" : "Suggest reply"}
          </button>
          <button
            type="button"
            onClick={runSummarize}
            disabled={!!busy}
            className="premium-panel__action"
          >
            {busy === "summarize" ? "Summarizing…" : "Summarize chat"}
          </button>
        </div>
      )}

      {summary && (
        <div className="premium-panel__summary">
          <p className="premium-panel__summary-label">Summary</p>
          <ul className="premium-panel__summary-list">
            {summary
              .split("\n")
              .map((line) => line.replace(/^•\s*/, "").trim())
              .filter(Boolean)
              .map((line, index) => (
                <li key={`${index}-${line.slice(0, 24)}`}>
                  <span className="premium-panel__bullet">•</span>
                  <span>{line}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="premium-panel__error" role="alert">
          {error}
        </p>
      )}
    </aside>
  );
}
