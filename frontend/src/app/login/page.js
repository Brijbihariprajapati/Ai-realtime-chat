"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import "./page.css";

function LoginContent() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  return (
    <main className="login-page">
      <div className="login-page__inner">
        <p className="login-page__brand">Deft</p>
        <h1 className="login-page__headline">
          Real-time chat with Gemini AI and instant Premium unlocks.
        </h1>
        <p className="login-page__desc">
          Sign in with Google to join the room, message live, and unlock AI
          suggest & summarize after payment.
        </p>

        {error && (
          <p className="login-page__error" role="alert">
            Sign-in failed. Please try again.
          </p>
        )}

        <button
          type="button"
          onClick={loginWithGoogle}
          className="login-page__btn"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 36 26.8 37 24 37c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.5l.1.1 6.2 5.2C39.1 36.4 44 31 44 24c0-1.3-.1-2.5-.4-3.5z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<main className="login-page__loading">Loading…</main>}
    >
      <LoginContent />
    </Suspense>
  );
}
