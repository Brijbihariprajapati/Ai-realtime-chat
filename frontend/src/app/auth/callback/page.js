"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import "./page.css";

function AuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const setSessionFromToken = useAuthStore((s) => s.setSessionFromToken);

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      router.replace("/login?error=missing_token");
      return;
    }

    setSessionFromToken(token)
      .then(() => router.replace("/"))
      .catch(() => router.replace("/login?error=session_failed"));
  }, [params, router, setSessionFromToken]);

  return <main className="auth-callback">Signing you in…</main>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="auth-callback">Signing you in…</main>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
