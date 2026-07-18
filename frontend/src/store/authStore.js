"use client";

import { create } from "zustand";
import { getMe, getToken, setToken, clearToken } from "@/lib/api";
import { disconnectSocket } from "@/lib/socket";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  refreshUser: async () => {
    const token = getToken();
    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    try {
      const res = await getMe();
      set({ user: res.data || null, loading: false });
    } catch {
      clearToken();
      set({ user: null, loading: false });
    }
  },

  setSessionFromToken: async (token) => {
    setToken(token);
    set({ loading: true });
    await get().refreshUser();
  },

  updateUser: (user) => set({ user }),

  loginWithGoogle: () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    window.location.href = `${apiUrl}/api/auth/google`;
  },

  logout: () => {
    clearToken();
    disconnectSocket();
    set({ user: null, loading: false });
  },
}));
