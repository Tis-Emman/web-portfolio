"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, Moon, Sun, Loader } from "lucide-react";

interface CommunityHeaderProps {
  isDark: boolean;
  isRefreshing: boolean;
  onToggleTheme: () => void;
  onRefresh: () => void;
}

export function CommunityHeader({
  isDark,
  isRefreshing,
  onToggleTheme,
  onRefresh,
}: CommunityHeaderProps) {
  return (
    <header className="community-header">
      <div className="container">
        <div className="community-header-content">
          <Link href="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <h1>Community Hub</h1>

          <div className="header-actions">
            <button
              className={`icon-btn ${isRefreshing ? "refreshing" : ""}`}
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh"
            >
              {isRefreshing ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <RefreshCw size={20} />
              )}
            </button>
            <button
              className="icon-btn"
              onClick={onToggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}