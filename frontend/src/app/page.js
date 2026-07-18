"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ChatRoom from "@/components/ChatRoom";
import "./page.css";

function HomeContent() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <main className="home-page__loading">Loading Deft…</main>;
  }

  return (
    <main className="home-page">
      <ChatRoom />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<main className="home-page__loading">Loading…</main>}>
      <HomeContent />
    </Suspense>
  );
}
