"use client";

import { useState } from "react";
import { Loader } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import type { SignInData } from "../../types/community";

interface SignInModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (data: SignInData) => void;
  onSwitchToRegister: () => void;
}

export function SignInModal({
  isOpen,
  isLoading,
  error,
  onClose,
  onSubmit,
  onSwitchToRegister,
}: SignInModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignInData>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="signin-modal active">
      <div className="modal-backdrop" onClick={() => !isLoading && onClose()} />

      <div className="modal-content-signin">
        <button
          className="close-signin-btn"
          onClick={() => !isLoading && onClose()}
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

        <form onSubmit={handleSubmit} className="signin-form">
          {/* Email Field */}
          <div className="form-group-signin">
            <label htmlFor="signin-email">Email Address</label>
            <input
              type="email"
              id="signin-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
                type={showPassword ? "text" : "password"}
                id="signin-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder=""
              />
              <button
                type="button"
                className="password-toggle-signin"
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
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}