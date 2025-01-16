"use client";
import React, { useState, useRef, useEffect } from "react";
import "./GameConsole.css"; // Import the CSS file
import Header from "../Components/MainHeader/mainHeader";
import Points from "../Components/gamepoints";
import Round from "../Components/gameRound/gameRound";
import {toast} from "react-toastify";

const GameConsole = () => {
  const clickSoundRef = useRef(null);
  const clock = useRef(null);
  const [timer, setTimer] = useState(10); // Timer duration in seconds
  const [isFlipped, setIsFlipped] = useState(true);
  const [lines, setLines] = useState([]); // For rendering strokes dynamically
  const [opportunity, setOpportunity] = useState(0); 
  const [roundTimer, setRoundTimer] = useState(60);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null); // Player's current selection
  const [isLocked, setIsLocked] = useState(false); // Whether the decision is locked
  const [frozen, setFrozen] = useState(false);
  const [breakTie, setBreakTie] = useState(false);
  const [rounds, setRounds] = useState([
    { yesScore: 1000, noScore: 1000, nullScore: false, isPlayed: false },
    { yesScore: 1000, noScore: 1000, nullScore:false,  isPlayed: false },
    { yesScore: 1000, noScore: 1000, nullScore:false, isPlayed: false },
  ]);

  useEffect(() => {
    clickSoundRef.current = new Audio('Sounds/click_sound.wav');
    clickSoundRef.current.load();
    clock.current = new Audio('Sounds/clock.mp3');
    clock.current.load();
  }, [])
  
  const handleNextOpportunity = () => {
      // Move to the next round
      setRounds((prevRounds) =>
        prevRounds.map((round, index) =>
          index === opportunity
            ? { ...round, isPlayed: true }
            : round
        )
      );
      if(opportunity < rounds.length - 1){
        setOpportunity(prev => prev + 1);
      }
     
  };

  const handleYesClick = () => {
setSelectedOption("Yes");
toast.info("Decision made! Click the center logo to lock it in.")
  };

  const handleNoClick = () => {
    // Update no score
  setSelectedOption("No");
  toast.info("Decision made! Click the center logo to lock it in.")
  };

  const updateScore = () => {
    if(selectedOption === "Yes") {
      setRounds((prevRounds) =>
        prevRounds.map((round, index) =>
          index === opportunity
            ? { ...round, yesScore: round.yesScore + 1 }
            : round
        )
      );
    } else if(selectedOption === "No"){
      setRounds((prevRounds) =>
        prevRounds.map((round, index) =>
          index === opportunity
            ? { ...round, noScore: round.noScore + 1 }
            : round
        )
      );
    } 
    // Update no score
    handleNextOpportunity();
  };

  const updateNullScore = () => {
    setRounds((prevRounds) =>
      prevRounds.map((round, index) =>
        index === opportunity
          ? { ...round, nullScore: true}
          : round
      )
    );
    console.log(rounds);
    handleNextOpportunity();
  }

  const lockInOption = () => {
    if(selectedOption === null){
      toast.error("Select an option before locking in.")
    }else{
      clickSoundRef.current.play();
      setIsLocked(true);
      toast.success("Decision locked! Await final results.")
    }
  };

  const allRoundsPlayed = rounds.every((round) => round.isPlayed);
  

  // Create lines dynamically
  useEffect(() => {
    const newLines = [];
    for (let i = 0; i < 60; i++) {
      newLines.push({ id: i, active: false });
    }
    setLines(newLines);
  }, []);

  //flipping based on when timer for game to start kickoffs
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown); // Cleanup on unmount or state update
    } else {
      setIsFlipped(false); // Flip card when timer ends
    }
  }, [timer]);
  // Update active strokes based on the timer
  useEffect(() => {
    const updateLines = () => {
      setLines((prevLines) =>
        prevLines.map((line, index) => ({
          ...line,
          active: index < 60 - roundTimer, // Light up based on remaining time
        }))
      );
    };
  
const moveToNextOpportunity = () => {
  if(opportunity < rounds.length - 1){
    setSelectedOption(null);
    setIsLocked(false);
    setTimer(10);
    setRoundTimer(60)
    setIsFlipped(true);
    clock.current.pause();
  }else{
    setFrozen(true);
    setCurrentRound(prev => prev + 1);
    setRounds([
      { yesScore: 1000, noScore: 1000, nullScore: false, isPlayed: false },
      { yesScore: 1000, noScore: 1000, nullScore:false,  isPlayed: false },
      { yesScore: 1000, noScore: 1000, nullScore:false, isPlayed: false },
    ]);
    toast.info("OOPS! you didn't qualify for the next round.");
  }
}

    const handleCountdown = () => {
      const countdown = setInterval(() => {
        setRoundTimer((prev) => prev - 1);
        clock.current.play();
        updateLines();
      }, 1000);
  
      return () => clearInterval(countdown);
    };
  
    if (roundTimer > 0 && timer === 0) {
      if (!isLocked) {
        return handleCountdown();
      } else {
        return handleCountdown();
      }
    } else if (isLocked && roundTimer <= 0) {
      updateScore();
      moveToNextOpportunity();
    } else if (!isLocked && roundTimer <= 0) {
      updateNullScore();
     moveToNextOpportunity();
      toast.error("Oops! You didn't lock in your decision!");
    }
  }, [roundTimer, isLocked, timer]);
  

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="game-console">
      <Header />
      <div className="console-container">
        <Points currentRound={currentRound}/>
        {rounds.map((round, index) => (
          <Round
            key={index}
            round={index + 1}
            yesScore={round.yesScore}
            noScore={round.noScore}
            isPlayed={round.isPlayed}
            nullScore={round.nullScore}
            isActive={index === currentRound}
            currentRound={opportunity}
          />
        ))}
      </div>

      

      <div className="game-button-container game-flip-card">
  <div className={`game-flip-card-inner ${isFlipped ? "game-flipped" : ""}`}>
  {!frozen && !breakTie && (
      <div className="buttonsContainer">
        <button
          className="game_stroke_links game_single_button"
          onClick={(e) => {
            e.stopPropagation();
            handleYesClick();
            clickSoundRef.current.play();
          }}
        >
          Yes
        </button>

        <button
          className="game_stroke_links game_single_button"
          onClick={() => {
            handleNoClick();
            clickSoundRef.current.play();
          }}
        >
          No
        </button>
        <div
          className="button_circle"
          onClick={() => {
            lockInOption();
          }}
        >
          <div className="lines" id="lines">
            {lines.map((line) => (
              <div
                key={line.id}
                className={`line ${line.active ? "active" : ""}`}
                style={{
                  transform: `rotate(${line.id * 6}deg) translateX(-50%)`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    )}
    
    <div className="game-flip-card-back">
      <h1 className="big_timer">{formatTime(timer)}</h1>
      <p>Count down to next game</p>
    </div>


    {frozen && (
      <div className="frozenButtonContainer">
        <p className="frozen_text">oops! You are frozen.</p>
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default GameConsole;
