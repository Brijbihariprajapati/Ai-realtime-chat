"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthInit() {
  const refreshUser = useAuthStore((s) => s.refreshUser);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return null;
}
