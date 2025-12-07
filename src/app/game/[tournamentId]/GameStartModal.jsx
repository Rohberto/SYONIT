import { useEffect } from "react";
import "./GameStartModal.css"; // Import the CSS file

const GameStartModal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game Starting Soon!</h2>
        <p>Get ready to make your decision!</p>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GameStartModal;
