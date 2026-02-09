"use client";

import { MessageCircle } from "lucide-react";
import type { Post } from "../../types/community";
interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
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
  );
}