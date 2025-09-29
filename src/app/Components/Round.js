"use client";
import React, { useState, useEffect } from "react";

const Round = ({ round, currentRound, yesScore, noScore, isPlayed, minority }) => {
  const [highlightY, setHighlightY] = useState(false);

  // Randomly assign background before play
  useEffect(() => {
    if (!isPlayed) {
      setHighlightY(Math.random() < 0.5);
    }
  }, [round, isPlayed]);

  const yesIsHigher = yesScore > noScore;
  const noIsHigher = noScore > yesScore;

  const showNone = isPlayed && minority === "none";

  return (
    <div className="game_round">
      <div
        className={`y-section 
          ${!isPlayed && highlightY ? "highlight" : ""} 
          ${isPlayed && minority === "yes" ? "highlight" : ""} 
          ${isPlayed ? "played" : ""}`}
      >
        <p>
          <span className="Y_icon">Y</span>
          <span className="yes_count">{yesScore}</span>
        </p>
      </div>

      <div className="round_section">
        {showNone ? <div className="none_label">None</div> : minority ? minority : round}
        
      </div>

      <div
        className={`n-section 
          ${!isPlayed && !highlightY ? "highlight" : ""} 
          ${isPlayed && minority === "no" ? "highlight" : ""} 
          ${isPlayed ? "played" : ""}`}
      >
        <p>
          <span className="no_count">{noScore}</span>
          <span className="N_icon">N</span>
        </p>
      </div>
    </div>
  );
};

export default Round;
