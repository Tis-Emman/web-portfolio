"use client";

import { useState } from "react";
import { Loader, Mail } from "lucide-react";

interface EmailVerificationProps {
  isOpen: boolean;
  email: string;
  onResend: () => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

export function EmailVerification({
  isOpen,
  email,
  onResend,
  onClose,
}: EmailVerificationProps) {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    setResendLoading(true);
    setResendError("");

    const result = await onResend();

    if (result.success) {
      alert("Verification email sent! Check your inbox.");
    } else {
      setResendError(result.error || "Failed to resend email");
    }

    setResendLoading(false);
  };

  if (!isOpen) return null;

  return (
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
            <span className="verification-email">{email}</span>
          </p>

          <p className="verification-instruction">
            Click the link in your email to confirm your account.
          </p>

          <div className="verification-waiting">
            <Loader size={16} className="animate-spin" />
            <span>Waiting for confirmation...</span>
          </div>

          {resendError && (
            <div
              style={{
                padding: "0.5rem",
                marginTop: "1rem",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#ef4444",
                fontSize: "0.85rem",
              }}
            >
              {resendError}
            </div>
          )}

          <div className="verification-actions">
            <button
              onClick={handleResend}
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

            <button onClick={onClose} className="btn-close-verification">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}