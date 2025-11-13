"use client";
import { useEffect } from "react";
import "./MessageModal.css"; // We'll create this next

const MessageModal = ({ isOpen, message, onClose, autoDismiss = 5000 }) => {
  // Auto-dismiss after specified time
  useEffect(() => {
    if (!isOpen || !autoDismiss) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoDismiss);
    return () => clearTimeout(timer);
  }, [isOpen, autoDismiss, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} className="modal-button">
          OK
        </button>
      </div>
    </div>
  );
};

export default MessageModal;