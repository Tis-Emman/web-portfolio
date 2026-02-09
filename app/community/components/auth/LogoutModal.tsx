"use client";

import { Loader, LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="logout-modal active">
      <div
        className="modal-backdrop"
        onClick={() => !isLoading && onClose()}
      />

      <div className="logout-modal-content">
        <h2 className="logout-modal-title">Log Out?</h2>

        <p className="logout-modal-description">
          Are you sure you want to log out? You'll need to sign in again to
          participate in discussions.
        </p>

        <div className="logout-modal-actions">
          <button
            className="btn-cancel-logout"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            className="btn-confirm-logout"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut size={16} />
                Log Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}