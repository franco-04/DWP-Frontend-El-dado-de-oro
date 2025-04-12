import React, { useEffect } from "react";
import "./WinModal.css";

const WinModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="win-modal-container">
      <div className="win-modal-content">
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="win-modal-message">{message}</div>
        <div className="sparkles">✨✨✨</div>
      </div>
    </div>
  );
};

export default WinModal;