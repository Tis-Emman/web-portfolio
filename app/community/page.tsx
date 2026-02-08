"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Moon,
  Sun,
  MessageCircle,
  UserPlus,
  GraduationCap,
  Briefcase,
  LogOut,
  Loader,
  Mail,
} from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

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

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: "student" | "professional";
  school: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

type RegistrationStep = "form" | "waiting" | "success";

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState<"latest" | "most_discussed">(
    "latest",
  );
  const [isDark, setIsDark] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Registration flow states
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>("form");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "student",
    school: "",
  });

  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });

  // Check auth state on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
        });
      } else {
        setUser(null);
      }

      setIsCheckingAuth(false);
    };

    initAuth();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email || "",
            firstName: profile?.first_name || "",
            lastName: profile?.last_name || "",
          });
        } else {
          setUser(null);
        }
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Monitor email confirmation
  useEffect(() => {
    if (!waitingForConfirmation) return;

    const checkEmailConfirmed = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.email_confirmed_at) {
          // Email is confirmed!
          setRegistrationStep("success");
          setWaitingForConfirmation(false);
        }
      } catch (err) {
        console.error("Email check error:", err);
      }
    };

    // Check every 2 seconds
    const interval = setInterval(checkEmailConfirmed, 2000);

    return () => clearInterval(interval);
  }, [waitingForConfirmation]);

  // Theme toggle logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 500);
  };

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (type: "student" | "professional") => {
    setRegistrationData((prev) => ({
      ...prev,
      userType: type,
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      console.log("User created successfully:", authData.user.id);

      // Step 2: Create profile in profiles table
      const profileData = {
        id: authData.user.id,
        email: registrationData.email,
        first_name: registrationData.firstName,
        last_name: registrationData.lastName,
        user_type: registrationData.userType,
        school: registrationData.school || null,
      };

      console.log("Inserting profile:", profileData);

      const { data: insertData, error: profileError } = await supabase
        .from("profiles")
        .insert([profileData])
        .select();

      if (profileError) {
        console.error("Profile insertion error details:", profileError);
        setError(`Failed to create profile: ${profileError.message}`);
        setIsLoading(false);
        return;
      }

      console.log("Profile created successfully:", insertData);

      // Show email verification popup
      setVerificationEmail(registrationData.email);
      setRegistrationStep("waiting");
      setWaitingForConfirmation(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(err.message || "An error occurred during registration");
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: verificationEmail,
      });

      if (error) {
        setError(`Failed to resend: ${error.message}`);
      } else {
        setError("");
        alert("Verification email sent! Check your inbox.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend email");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) {
        console.error("Sign in error:", error);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError("Sign in failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success! Close modal and reset form
      setShowSignInModal(false);
      setSignInData({
        email: "",
        password: "",
      });
      // Auth state listener will update UI
      setIsLoading(false);
    } catch (err: any) {
      console.error("Unexpected sign in error:", err);
      setError(err.message || "An error occurred during sign in");
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // First, clear the user state immediately
      setUser(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
        console.error("Logout error:", error);
        setError(error.message);
        return;
      }

      // Clear any additional local storage items if needed
      localStorage.removeItem('supabase.auth.token');
      
      console.log("Logout successful");

    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || "Logout failed");
    }
  };

  const closeRegistrationFlow = () => {
    setShowRegisterModal(false);
    setRegistrationStep("form");
    setVerificationEmail("");
    setWaitingForConfirmation(false);
    setError("");
    setRegistrationData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "student",
      school: "",
    });
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

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="community-hub-page">
        <header className="community-header">
          <div className="container">
            <div className="community-header-content">
              <Link href="/" className="back-link">
                <ArrowLeft size={20} />
                Back to Home
              </Link>
              <h1>Community Hub</h1>
              <div className="header-actions">
                <button className="icon-btn" disabled>
                  <Loader size={20} className="animate-spin" />
                </button>
              </div>
            </div>
          </div>
        </header>
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
                className={`icon-btn ${isRefreshing ? "refreshing" : ""}`}
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <button
                className="icon-btn"
                onClick={toggleTheme}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
            {/* Conditional Rendering: Show based on auth state */}
            {user ? (
              // User IS logged in
              <div className="card">
                <h3 className="sidebar-title">Welcome back! 👋</h3>
                <p className="sidebar-description">
                  {user.firstName} {user.lastName}, you're part of the community
                </p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    // TODO: Navigate to create post
                    console.log("Create post clicked");
                  }}
                >
                  <MessageCircle size={18} /> Create Post
                </button>
                <button className="btn-secondary" onClick={handleLogout}>
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              // User is NOT logged in
              <div className="card">
                <h3 className="sidebar-title">Join the Community</h3>
                <p className="sidebar-description">
                  Sign up to join discussions, ask questions, and share
                  knowledge.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => setShowRegisterModal(true)}
                >
                  <UserPlus size={18} /> Register to Participate
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowSignInModal(true)}
                >
                  Sign In
                </button>
              </div>
            )}

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

      {/* Registration Modal - Only show if not in waiting/success step */}
      {showRegisterModal && registrationStep === "form" && (
        <div className={`registration-modal active`}>
          <div
            className="modal-backdrop"
            onClick={() => !isLoading && closeRegistrationFlow()}
          />

          <div className="modal-content-register">
            <button
              className="close-register-btn"
              onClick={closeRegistrationFlow}
              disabled={isLoading}
            >
              <MdClose size={28} />
            </button>

            <h2 className="modal-title">Join the Community</h2>

            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  marginBottom: "1rem",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  color: "#ef4444",
                  fontSize: "0.85rem",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="registration-form">
              {/* Name Fields */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={registrationData.firstName}
                    onChange={handleRegisterInputChange}
                    required
                    disabled={isLoading}
                    placeholder=""
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={registrationData.lastName}
                    onChange={handleRegisterInputChange}
                    required
                    disabled={isLoading}
                    placeholder=""
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleRegisterInputChange}
                  required
                  disabled={isLoading}
                  placeholder=""
                />
                <small className="form-hint">
                  This will be your sign-in email
                </small>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={registrationData.password}
                    onChange={handleRegisterInputChange}
                    required
                    disabled={isLoading}
                    placeholder=""
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                </div>
                <small className="form-hint">
                  Must be at least 6 characters long
                </small>
              </div>

              {/* User Type Selection */}
              <div className="form-group">
                <label>I am a</label>
                <div className="user-type-buttons">
                  <button
                    type="button"
                    className={`user-type-btn ${registrationData.userType === "student" ? "active" : ""}`}
                    onClick={() => handleUserTypeChange("student")}
                    disabled={isLoading}
                  >
                    <GraduationCap size={18} />
                    Student
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn ${registrationData.userType === "professional" ? "active" : ""}`}
                    onClick={() => handleUserTypeChange("professional")}
                    disabled={isLoading}
                  >
                    <Briefcase size={18} />
                    Professional
                  </button>
                </div>
              </div>

              {/* School Field */}
              <div className="form-group">
                <label htmlFor="school">School/University (Optional)</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={registrationData.school}
                  onChange={handleRegisterInputChange}
                  disabled={isLoading}
                  placeholder="e.g., Stanford University"
                />
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeRegistrationFlow}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-join" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Join Community"
                  )}
                </button>
              </div>

              {/* Sign In Link */}
              <div className="sign-in-link-container">
                <span>Already have an account? </span>
                <button
                  type="button"
                  className="sign-in-link"
                  onClick={() => {
                    closeRegistrationFlow();
                    setShowSignInModal(true);
                  }}
                  disabled={isLoading}
                >
                  Sign in here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Verification Popup */}
      {showRegisterModal && registrationStep === "waiting" && (
        <div className="registration-modal active">
          <div className="modal-backdrop" />

          <div className="modal-content-register verification-popup">
            <h2 className="modal-title">
              <Mail
                size={24}
                style={{ color: "var(--accent-cyan)", marginRight: "0.5rem" }}
              />
              Verify Your Email
            </h2>

            <div className="verification-content">
              <div className="verification-icon">📧</div>

              <p className="verification-email-text">
                A verification link has been sent to:
                <br />
                <span className="verification-email">{verificationEmail}</span>
              </p>

              <p className="verification-instruction">
                Click the link in your email to confirm your account.
              </p>

              <div className="verification-waiting">
                <Loader size={16} className="animate-spin" />
                <span>Waiting for confirmation...</span>
              </div>

              <div className="verification-actions">
                <button
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  className="btn-resend"
                >
                  {resendLoading ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={14} />
                      Resend Email
                    </>
                  )}
                </button>

                <button
                  onClick={closeRegistrationFlow}
                  className="btn-close-verification"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showRegisterModal && registrationStep === "success" && (
        <div className="registration-modal active">
          <div className="modal-backdrop" />

          <div className="modal-content-register success-popup">
            <div className="success-content">
              <div className="success-icon">✅</div>

              <h2 className="modal-title">Welcome! 🎉</h2>

              <p className="success-text">
                Your email has been verified!
                <br />
                Your account is ready to use.
              </p>

              <button
                onClick={() => {
                  closeRegistrationFlow();
                  setShowRegisterModal(false);
                }}
                className="btn-success"
              >
                Continue to Community Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <div className={`signin-modal ${showSignInModal ? "active" : ""}`}>
        <div
          className="modal-backdrop"
          onClick={() => !isLoading && setShowSignInModal(false)}
        />

        <div className="modal-content-signin">
          <button
            className="close-signin-btn"
            onClick={() => !isLoading && setShowSignInModal(false)}
            disabled={isLoading}
          >
            <MdClose size={28} />
          </button>

          <h2 className="modal-title-signin">Sign In</h2>

          {error && (
            <div
              style={{
                padding: "0.75rem",
                marginBottom: "1rem",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#ef4444",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSignInSubmit} className="signin-form">
            {/* Email Field */}
            <div className="form-group-signin">
              <label htmlFor="signin-email">Email Address</label>
              <input
                type="email"
                id="signin-email"
                name="email"
                value={signInData.email}
                onChange={handleSignInInputChange}
                required
                disabled={isLoading}
                placeholder=""
              />
            </div>

            {/* Password Field */}
            <div className="form-group-signin">
              <label htmlFor="signin-password">Password</label>
              <div className="password-wrapper-signin">
                <input
                  type={showSignInPassword ? "text" : "password"}
                  id="signin-password"
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInInputChange}
                  required
                  disabled={isLoading}
                  placeholder=""
                />
                <button
                  type="button"
                  className="password-toggle-signin"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  disabled={isLoading}
                >
                  {showSignInPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button type="submit" className="btn-signin" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register Link */}
            <div className="register-link-container">
              <span>Need an account? </span>
              <button
                type="button"
                className="register-link"
                onClick={() => {
                  setShowSignInModal(false);
                  setShowRegisterModal(true);
                  setRegistrationStep("form");
                  setError("");
                }}
                disabled={isLoading}
              >
                Register here
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer style={{ marginTop: 50 }}>
        <p>&copy; 2026 Emmanuel Dela Pena. All Rights Reserved.</p>
        <p>Developed in Baliuag City, Bulacan, Philippines</p>
      </footer>
    </div>
  );
}