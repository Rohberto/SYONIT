"use client";
import React, { useState, useEffect } from "react";
import "./gameRound.css";

const Round = ({ round, currentRound, yesScore, noScore, isPlayed, duration = 10 }) => {
  const [highlightY, setHighlightY] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  // Randomly assign background before play
  useEffect(() => {
    if (!isPlayed) {
      setHighlightY(Math.random() < 0.5);
    }
  }, [round, isPlayed]);

  // Countdown timer
  useEffect(() => {
    if (isPlayed) return; // stop timer once round is played

    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPlayed]);

  // Determine which score is higher
  const yesIsHigher = yesScore > noScore;
  const noIsHigher = noScore > yesScore;

  // Progress circle setup
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / duration) * circumference;

  return (
    <div className="main_game_round">
      {/* YES section */}
      <div
        className={`y-section 
          ${!isPlayed && highlightY ? "highlight" : ""} 
          ${isPlayed && yesIsHigher ? "highlight" : ""} 
          ${isPlayed ? "played" : ""}`}
      >
        <p>
          <span className="Y_icon">Y</span>
          <span className="yes_count">{yesScore}</span>
        </p>
      </div>

      {/* Round + Timer */}
      <div className="round_section">
        <div className="timer-container">
          <svg className="progress-ring" width="60" height="60">
            <circle
              className="progress-ring__background"
              stroke="#ddd"
              fill="transparent"
              strokeWidth="4"
              r={radius}
              cx="30"
              cy="30"
            />
            <circle
              className="progress-ring__circle"
              stroke="#4cafef"
              fill="transparent"
              strokeWidth="4"
              r={radius}
              cx="30"
              cy="30"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className="timer-text">{timeLeft}</span>
        </div>
        <p>Round {round}</p>
      </div>

      {/* NO section */}
      <div
        className={`n-section 
          ${!isPlayed && !highlightY ? "highlight" : ""} 
          ${isPlayed && noIsHigher ? "highlight" : ""} 
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
