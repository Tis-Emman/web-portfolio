"use client";

interface RegistrationSuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationSuccess({
  isOpen,
  onClose,
}: RegistrationSuccessProps) {
  if (!isOpen) return null;

  return (
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

          <button onClick={onClose} className="btn-success">
            Continue to Community Hub
          </button>
        </div>
      </div>
    </div>
  );
}