"use client";

import { useAuthStore } from "@/store/authStore";
import "./ProfileBar.css";

export default function ProfileBar({ connected }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (!user) return null;

  return (
    <header className="profile-bar">
      <div className="profile-bar__left">
        <img
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f3d3e&color=fff`
          }
          alt={user.name}
          className="profile-bar__avatar"
        />
        <div className="profile-bar__info">
          <p className="profile-bar__name">{user.name}</p>
          <p className="profile-bar__email">{user.email}</p>
        </div>
        {user.isPremium && (
          <span className="profile-bar__badge">Premium</span>
        )}
      </div>

      <div className="profile-bar__right">
        <span
          className={
            "profile-bar__status " +
            (connected
              ? "profile-bar__status--ok"
              : "profile-bar__status--wait")
          }
        >
          <span className="profile-bar__dot" />
          {connected ? "Live" : "Reconnecting"}
        </span>
        <button type="button" onClick={logout} className="profile-bar__logout">
          Sign out
        </button>
      </div>
    </header>
  );
}
