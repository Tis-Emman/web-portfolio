"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Moon, Sun, MessageCircle } from "lucide-react";

interface Post {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  badge: string;
  title: string;
  content: string;
  comments: number;
}

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState<"latest" | "most_discussed">("latest");
  const [isDark, setIsDark] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Theme toggle logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh - you can replace this with actual data fetching
    setTimeout(() => {
      setIsRefreshing(false);
      // Optional: Show a toast notification or re-fetch data here
      window.location.reload();
    }, 500);
  };

  const posts: Post[] = [
    {
      id: "1",
      author: "Emmanuel Dela Pena",
      avatar: "🔵",
      timeAgo: "1 day ago",
      badge: "STI College Baliuag",
      title: "We're officially live!",
      content:
        "Currently preparing my portfolio for deployment after completing local development. Final refinements and testing are underway.",
      comments: 0,
    },
  ];

  return (
    <div className="community-hub-page">
      {/* Header */}
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
                className={`icon-btn ${isRefreshing ? 'refreshing' : ''}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <button 
                className="icon-btn" 
                onClick={toggleTheme}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="community-grid">
          {/* Sidebar */}
          <aside className="community-sidebar">
            {/* Join Card */}
            <div className="card">
              <h3 className="sidebar-title">Join the Community</h3>
              <p className="sidebar-description">
                Sign up to join discussions, ask questions, and share knowledge.
              </p>
              <button className="btn-primary">
                <span>👤</span> Register to Participate
              </button>
              <button className="btn-secondary">Sign In</button>
            </div>

            {/* Stats Card */}
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

          {/* Posts Section */}
          <main className="community-main">
            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === "latest" ? "active" : ""}`}
                onClick={() => setActiveTab("latest")}
              >
                Latest
              </button>
              <button
                className={`tab ${activeTab === "most_discussed" ? "active" : ""}`}
                onClick={() => setActiveTab("most_discussed")}
              >
                Most Discussed
              </button>
            </div>

            {/* Posts List */}
            <div className="posts-list">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="author-info">
                      <span className="author-avatar">{post.avatar}</span>
                      <div>
                        <h4 className="author-name">{post.author}</h4>
                        <div className="post-meta">
                          <span className="post-time">{post.timeAgo}</span>
                          <span className="post-badge">{post.badge}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-text">{post.content}</p>
                  </div>

                  <div className="post-footer">
                    <div className="post-stats">
                      <MessageCircle size={16} />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>


        </div>

      </div>
                              <footer style={{marginTop: 50}}>
        <p>&copy; 2026 Emmanuel Dela Pena. All Rights Reserved.</p>
        <p>Developed in Baliuag City, Bulacan, Philippines</p>
      </footer>
    </div>
  );
}