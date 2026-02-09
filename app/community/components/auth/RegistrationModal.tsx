"use client";

import { useState } from "react";
import { Loader, GraduationCap, Briefcase } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import type { RegistrationData } from "../../types/community";

interface RegistrationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (data: RegistrationData) => void;
  onSwitchToSignIn: () => void;
}

export function RegistrationModal({
  isOpen,
  isLoading,
  error,
  onClose,
  onSubmit,
  onSwitchToSignIn,
}: RegistrationModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "student",
    school: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (type: "student" | "professional") => {
    setFormData((prev) => ({
      ...prev,
      userType: type,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="registration-modal active">
      <div
        className="modal-backdrop"
        onClick={() => !isLoading && onClose()}
      />

      <div className="modal-content-register">
        <button
          className="close-register-btn"
          onClick={onClose}
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

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
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
                value={formData.lastName}
                onChange={handleInputChange}
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
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder=""
            />
            <small className="form-hint">This will be your sign-in email</small>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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
                className={`user-type-btn ${formData.userType === "student" ? "active" : ""}`}
                onClick={() => handleUserTypeChange("student")}
                disabled={isLoading}
              >
                <GraduationCap size={18} />
                Student
              </button>
              <button
                type="button"
                className={`user-type-btn ${formData.userType === "professional" ? "active" : ""}`}
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
              value={formData.school}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="e.g., Stanford University"
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
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
              onClick={onSwitchToSignIn}
              disabled={isLoading}
            >
              Sign in here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}