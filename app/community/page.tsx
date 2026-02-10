"use client";

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { CommunityHeader } from "./components/community/CommunityHeader";
import { Sidebar } from "./components/community/Sidebar";
import { PostList } from "./components/community/PostList";
import { RegistrationModal } from "./components/auth/RegistrationModal";
import { SignInModal } from "./components/auth/SignInModal";
import { LogoutModal } from "./components/auth/LogoutModal";
import { EmailVerification } from "./components/auth/EmailVerification";
import { RegistrationSuccess } from "./components/auth/RegistrationSuccess";
import { CreatePostModal } from "./components/community/CreatePostModal";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useEmailVerification } from "./hooks/useEmailVerification";
import { usePosts } from "./hooks/usePosts";
import type { RegistrationData, SignInData, CreatePostData } from "./types/community";

export default function CommunityHub() {
  // Hooks
  const {
    user,
    isLoading: authLoading,
    isCheckingAuth,
    error: authError,
    setError: setAuthError,
    signUp,
    signIn,
    signOut,
    resendVerificationEmail,
  } = useAuth();

  const { isDark, toggleTheme } = useTheme();

  const {
    registrationStep,
    verificationEmail,
    setRegistrationStep,
    startWaitingForVerification,
    resetVerification,
  } = useEmailVerification();

  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
    createPost,
    refreshPosts,
  } = usePosts(user);

  // Local state
  const [activeTab, setActiveTab] = useState<"latest" | "most_discussed">(
    "latest"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [createPostError, setCreatePostError] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Auto-open the modal when the user arrives via the email verification link.
  // Supabase uses the implicit flow and puts tokens in the URL hash.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.slice(1));
    if (params.get("type") === "signup" && params.get("access_token")) {
      setShowRegisterModal(true);
    }
  }, []);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshPosts();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleRegisterSubmit = async (data: RegistrationData) => {
    const result = await signUp(data);

    if (result.success && result.email) {
      // Keep showRegisterModal=true so the EmailVerification modal renders
      startWaitingForVerification(result.email);
    }
  };

  const handleSignInSubmit = async (data: SignInData) => {
    const result = await signIn(data);

    if (result.success) {
      setShowSignInModal(false);
    }
  };

  const handleLogout = async () => {
    const result = await signOut();

    if (result.success) {
      setShowLogoutModal(false);
    }
  };

  const closeRegistrationFlow = () => {
    setShowRegisterModal(false);
    resetVerification();
    setAuthError("");
  };

  const handleCreatePost = () => {
    if (!user) {
      // If not logged in, prompt to sign in
      setShowSignInModal(true);
      return;
    }
    setShowCreatePostModal(true);
    setCreatePostError("");
  };

  const handleCreatePostSubmit = async (data: CreatePostData) => {
    setIsCreatingPost(true);
    setCreatePostError("");

    try {
      const result = await createPost(data);

      if (result.success) {
        // Success! Close modal and clear error
        setShowCreatePostModal(false);
        setCreatePostError("");
        
        // Optional: Show success message
        console.log("Post created successfully!");
      } else {
        // Show error in modal
        setCreatePostError(result.error || "Failed to create post");
      }
    } catch (error: any) {
      setCreatePostError(error?.message || "An unexpected error occurred");
    } finally {
      setIsCreatingPost(false);
    }
  };

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="community-hub-page">
        <CommunityHeader
          isDark={isDark}
          isRefreshing={false}
          onToggleTheme={toggleTheme}
          onRefresh={() => {}}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Loader size={40} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="community-hub-page">
      <CommunityHeader
        isDark={isDark}
        isRefreshing={isRefreshing}
        onToggleTheme={toggleTheme}
        onRefresh={handleRefresh}
      />

      <div className="container">
        <div className="community-grid">
          <Sidebar
            user={user}
            onRegisterClick={() => setShowRegisterModal(true)}
            onSignInClick={() => setShowSignInModal(true)}
            onLogoutClick={() => setShowLogoutModal(true)}
            onCreatePostClick={handleCreatePost}
          />

          <main className="community-main">
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

            {postsLoading && posts.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <Loader size={32} className="animate-spin" />
              </div>
            ) : postsError ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--text-secondary)",
                }}
              >
                <p>Failed to load posts. Please try refreshing.</p>
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  {postsError}
                </p>
              </div>
            ) : posts.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--text-secondary)",
                }}
              >
                <p>No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              <PostList posts={posts} />
            )}
          </main>
        </div>
      </div>

      {/* Registration form – only shown on the "form" step */}
      {registrationStep === "form" && (
        <RegistrationModal
          isOpen={showRegisterModal}
          isLoading={authLoading}
          error={authError}
          onClose={closeRegistrationFlow}
          onSubmit={handleRegisterSubmit}
          onSwitchToSignIn={() => {
            closeRegistrationFlow();
            setShowSignInModal(true);
          }}
        />
      )}

      {/* Email verification waiting screen */}
      {registrationStep === "waiting" && showRegisterModal && (
        <EmailVerification
          isOpen={true}
          email={verificationEmail}
          onResend={() => resendVerificationEmail(verificationEmail)}
          onClose={closeRegistrationFlow}
        />
      )}

      {/* Success screen after email confirmed */}
      {registrationStep === "success" && showRegisterModal && (
        <RegistrationSuccess isOpen={true} onClose={closeRegistrationFlow} />
      )}

      <SignInModal
        isOpen={showSignInModal}
        isLoading={authLoading}
        error={authError}
        onClose={() => {
          setShowSignInModal(false);
          setAuthError("");
        }}
        onSubmit={handleSignInSubmit}
        onSwitchToRegister={() => {
          setShowSignInModal(false);
          setShowRegisterModal(true);
          setRegistrationStep("form");
          setAuthError("");
        }}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        isLoading={authLoading}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <CreatePostModal
        isOpen={showCreatePostModal}
        isLoading={isCreatingPost}
        error={createPostError}
        onClose={() => {
          setShowCreatePostModal(false);
          setCreatePostError("");
        }}
        onSubmit={handleCreatePostSubmit}
      />

      <footer style={{ marginTop: 50 }}>
        <p>&copy; 2026 Emmanuel Dela Pena. All Rights Reserved.</p>
        <p>Developed in Baliuag City, Bulacan, Philippines</p>
      </footer>
    </div>
  );
}