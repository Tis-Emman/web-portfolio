"use client";

import { useState, useEffect } from "react";
import { Loader, Send } from "lucide-react";
import { MdClose } from "react-icons/md";
import type { CreatePostData } from "../../types/community";

interface CreatePostModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => Promise<void>;
}

export function CreatePostModal({
  isOpen,
  isLoading,
  error,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const [formData, setFormData] = useState<CreatePostData>({
    title: "",
    content: "",
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: "", content: "" });
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call the onSubmit handler
    await onSubmit(formData);
    
    // Note: Don't clear form or close modal here
    // The parent component will handle closing on success
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-post-modal active">
      <div className="modal-backdrop" onClick={handleClose} />

      <div className="modal-content-create-post">
        <button
          className="close-create-post-btn"
          onClick={handleClose}
          disabled={isLoading}
        >
          <MdClose size={28} />
        </button>

        <h2 className="modal-title-create-post">Create New Post</h2>

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

        <form onSubmit={handleSubmit} className="create-post-form">
          {/* Title Field */}
          <div className="form-group-create-post">
            <label htmlFor="post-title">Title</label>
            <input
              type="text"
              id="post-title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="What's your post about?"
              maxLength={200}
            />
            <small className="form-hint-create-post">
              {formData.title.length}/200 characters
            </small>
          </div>

          {/* Content Field */}
          <div className="form-group-create-post">
            <label htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="Share your thoughts, ask a question, or start a discussion..."
              rows={8}
              maxLength={5000}
            />
            <small className="form-hint-create-post">
              {formData.content.length}/5000 characters
            </small>
          </div>

          {/* Form Actions */}
          <div className="form-actions-create-post">
            <button
              type="button"
              className="btn-cancel-create-post"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-create-post"
              disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Post to Community
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}