"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Post, CreatePostData, User } from "../types/community";

export function usePosts(user: User | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch posts from database
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      // First, check if posts table exists by doing a simple query
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Supabase error:", fetchError);
        throw new Error(fetchError.message || "Failed to fetch posts");
      }

      // If no posts yet, return empty array
      if (!data || data.length === 0) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      // Fetch user profiles separately for each post
      const postsWithProfiles = await Promise.all(
        data.map(async (post) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name, school")
            .eq("id", post.user_id)
            .single();

          const fullName = profile
            ? `${profile.first_name} ${profile.last_name}`
            : "Anonymous User";

          const avatar = profile?.first_name
            ? profile.first_name.charAt(0).toUpperCase()
            : "?";

          const timeAgo = getTimeAgo(post.created_at);

          return {
            id: post.id,
            author: fullName,
            avatar: avatar,
            timeAgo: timeAgo,
            badge: profile?.school || "Community Member",
            title: post.title,
            content: post.content,
            comments: 0,
            user_id: post.user_id,
            created_at: post.created_at,
            updated_at: post.updated_at,
          };
        })
      );

      setPosts(postsWithProfiles);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      const errorMessage = err?.message || "Failed to load posts. Please check your database setup.";
      setError(errorMessage);
      setPosts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new post
  const createPost = async (data: CreatePostData) => {
    if (!user) {
      return { success: false, error: "You must be signed in to create a post" };
    }

    setError("");

    try {
      const { data: newPost, error: insertError } = await supabase
        .from("posts")
        .insert([
          {
            user_id: user.id,
            title: data.title,
            content: data.content,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(insertError.message || "Failed to create post");
      }

      // Refresh posts after creating
      await fetchPosts();

      return { success: true };
    } catch (err: any) {
      console.error("Error creating post:", err);
      const errorMessage = err?.message || "Failed to create post";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete a post (only by author)
  const deletePost = async (postId: string) => {
    if (!user) {
      return { success: false, error: "You must be signed in to delete a post" };
    }

    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw new Error(deleteError.message || "Failed to delete post");
      }

      // Refresh posts after deleting
      await fetchPosts();

      return { success: true };
    } catch (err: any) {
      console.error("Error deleting post:", err);
      const errorMessage = err?.message || "Failed to delete post";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Load posts on mount and when user changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          // Refresh posts when any change occurs
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  return {
    posts,
    isLoading,
    error,
    createPost,
    deletePost,
    refreshPosts: fetchPosts,
  };
}

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}