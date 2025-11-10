"use client";
import React, { useState, useEffect } from "react";

const Round = ({ round, currentRound, yesScore, noScore, isPlayed, minority, roundId}) => {
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
        className={`y-section y${roundId}section
          ${isPlayed && minority === "yes" ? "section_highlight" : ""} 
          ${isPlayed ? "played" : ""}`}
      >
        <p>
            {yesScore}
        </p>
      </div>

      <div className={`${isPlayed ? "round_played_section" : "round_section"}`}>
        {showNone ? <div className="none_label">None</div> : minority ? minority === "yes" ? "Y" : "N" : round}
      </div>

      <div
        className={`n-section n${roundId}section
         
          ${isPlayed && minority === "no" ? "section_highlight" : ""} 
          ${isPlayed ? "played" : ""}`}
      >
        <p>
          {noScore}
        </p>
      </div>
    </div>
  );
};

export default Round;
