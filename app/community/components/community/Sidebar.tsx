"use client";

import { MessageCircle, UserPlus, LogOut, LogIn } from "lucide-react";
import type { User } from "../../types/community";

interface SidebarProps {
  user: User | null;
  onRegisterClick: () => void;
  onSignInClick: () => void;
  onLogoutClick: () => void;
  onCreatePostClick: () => void;
}

export function Sidebar({
  user,
  onRegisterClick,
  onSignInClick,
  onLogoutClick,
  onCreatePostClick,
}: SidebarProps) {
  return (
    <aside className="community-sidebar">
      {user ? (
        <div className="card">
          <h3 className="sidebar-title">Welcome back!</h3>
          <h3 style={{ marginBottom: 10 }}>
            {user.firstName} {user.lastName}
          </h3>
          <p className="sidebar-description">You're part of the community</p>
          <button className="btn-primary" onClick={onCreatePostClick}>
            <MessageCircle size={18} /> Create Post
          </button>
          <button className="btn-logout" onClick={onLogoutClick}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      ) : (
        <div className="card">
          <h3 className="sidebar-title">Join the Community</h3>
          <p className="sidebar-description">
            Sign up to join discussions, ask questions, and share knowledge.
          </p>
          <button className="btn-primary" onClick={onRegisterClick}>
            <UserPlus size={18} /> Register to Participate
          </button>
          <button className="btn-signin-sidebar" onClick={onSignInClick}>
            <LogIn size={18} /> Sign In
          </button>
        </div>
      )}

      <div className="card">
        <h3 className="sidebar-title">Hub Stats</h3>
        <div className="stat-row">
          <span className="stat-label">Total Posts</span>
          <span className="stat-value">1</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">1</span>
        </div>
      </div>
    </aside>
  );
}