"use client";
import React, { useState, useRef, useEffect } from "react";
import "./GameConsole.css";
import Header from "../Components/MainHeader/mainHeader";
import Points from "../Components/gamepoints";
import Round from "../Components/gameRound/gameRound";
import { toast } from "react-toastify";
import AnimatedText from "../Components/AnimatedText";
import { getAudioContext, playSound as playAudioContextSound } from "../libs/audioContext";
import 'whatwg-fetch'; // Polyfill for older Safari

const GameConsole = () => {
  const [timer, setTimer] = useState(10); // Pre-game countdown
  const [isFlipped, setIsFlipped] = useState(true);
  const [lines, setLines] = useState([]);
  const [opportunity, setOpportunity] = useState(0);
  const [roundTimer, setRoundTimer] = useState(15); // Game phase timer
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [breakTie, setBreakTie] = useState(false);
  const [tickBuffer, setTickBuffer] = useState(null);
  const [countdownBuffer, setCountdownBuffer] = useState(null);
  const [clickBuffer, setClickBuffer] = useState(null);
  const [gameOverBuffer, setGameOverBuffer] = useState(null);
  const countdownSourceRef = useRef(null);
  const tickSourceRef = useRef(null);
  const [rounds, setRounds] = useState([
    { yesScore: 1000, noScore: 1000, nullScore: false, isPlayed: false },
    { yesScore: 1000, noScore: 1000, nullScore: false, isPlayed: false },
    { yesScore: 1000, noScore: 1000, nullScore: false, isPlayed: false },
  ]);

  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) {
      console.warn('Web Audio API not supported');
      return;
    }

    const loadSounds = async () => {
      try {
        const tickResponse = await fetch('/Sounds/clock_countdown.mp3');
        if (!tickResponse.ok) throw new Error('Failed to fetch tick sound');
        const tickArrayBuffer = await tickResponse.arrayBuffer();
        const tickAudioBuffer = await ctx.decodeAudioData(tickArrayBuffer);
        setTickBuffer(tickAudioBuffer);

        const countdownResponse = await fetch('/Sounds/main_countdown.mp3');
        if (!countdownResponse.ok) throw new Error('Failed to fetch countdown sound');
        const countdownArrayBuffer = await countdownResponse.arrayBuffer();
        const countdownAudioBuffer = await ctx.decodeAudioData(countdownArrayBuffer);
        setCountdownBuffer(countdownAudioBuffer);

        const clickResponse = await fetch('/Sounds/click_sound.wav');
        if (!clickResponse.ok) throw new Error('Failed to fetch click sound');
        const clickArrayBuffer = await clickResponse.arrayBuffer();
        const clickAudioBuffer = await ctx.decodeAudioData(clickArrayBuffer);
        setClickBuffer(clickAudioBuffer);

        const gameOverResponse = await fetch('/Sounds/fail.mp3');
        if (!gameOverResponse.ok) throw new Error('Failed to fetch game over sound');
        const gameOverArrayBuffer = await gameOverResponse.arrayBuffer();
        const gameOverAudioBuffer = await ctx.decodeAudioData(gameOverArrayBuffer);
        setGameOverBuffer(gameOverAudioBuffer);
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    };

    loadSounds();
  }, []);

  // Use playSound from audioContext.js with fallback
  const playSound = (buffer, fallbackUrl) => {
    playAudioContextSound(buffer, fallbackUrl);
  };

  const startCountdownSound = () => {
    if (!countdownBuffer || countdownSourceRef.current) return;
    const source = playAudioContextSound(countdownBuffer, '/Sounds/main_countdown.mp3');
    if (source) {
      countdownSourceRef.current = source;
      source.onended = () => {
        countdownSourceRef.current = null;
      };
    }
  };

  const pauseCountdownSound = () => {
    if (countdownSourceRef.current) {
      countdownSourceRef.current.stop ? countdownSourceRef.current.stop() : countdownSourceRef.current.pause();
      countdownSourceRef.current = null;
    }
  };

  const startTickSound = () => {
    if (!tickBuffer || tickSourceRef.current) return;
    const source = playAudioContextSound(tickBuffer, '/Sounds/clock_countdown.mp3');
    if (source) {
      source.loop = true;
      tickSourceRef.current = source;
    }
  };

  const stopTickSound = () => {
    if (tickSourceRef.current) {
      tickSourceRef.current.stop ? tickSourceRef.current.stop() : tickSourceRef.current.pause();
      tickSourceRef.current = null;
    }
  };

  const handleNextOpportunity = () => {
    setRounds((prevRounds) =>
      prevRounds.map((round, index) =>
        index === opportunity ? { ...round, isPlayed: true } : round
      )
    );
    if (opportunity < rounds.length - 1) {
      setOpportunity(prev => prev + 1);
    }
  };

  const handleYesClick = () => {
    if (clickBuffer) playSound(clickBuffer, '/Sounds/click_sound.wav');
    setSelectedOption("Yes");
    toast.info("Decision made! Click the center logo to lock it in.");
  };

  const handleNoClick = () => {
    if (clickBuffer) playSound(clickBuffer, '/Sounds/click_sound.wav');
    setSelectedOption("No");
    toast.info("Decision made! Click the center logo to lock it in.");
  };

  const updateScore = () => {
    if (selectedOption === "Yes") {
      setRounds((prevRounds) =>
        prevRounds.map((round, index) =>
          index === opportunity ? { ...round, yesScore: round.yesScore + 1 } : round
        )
      );
    } else if (selectedOption === "No") {
      setRounds((prevRounds) =>
        prevRounds.map((round, index) =>
          index === opportunity ? { ...round, noScore: round.noScore + 1 } : round
        )
      );
    }
    handleNextOpportunity();
  };

  const updateNullScore = () => {
    setRounds((prevRounds) =>
      prevRounds.map((round, index) =>
        index === opportunity ? { ...round, nullScore: true } : round
      )
    );
    handleNextOpportunity();
  };

  const lockInOption = () => {
    if (clickBuffer) playSound(clickBuffer, '/Sounds/click_sound.wav');
    if (!selectedOption) {
      toast.error("Select an option before locking in.");
    } else {
      setIsLocked(true);
      toast.success("Decision locked! Await final results.");
    }
  };

  const totalLines = 60;
  const activeLines = Math.floor(((15 - roundTimer) / 15) * totalLines);

  useEffect(() => {
    const newLines = Array.from({ length: 60 }, (_, i) => ({ id: i, active: false }));
    setLines(newLines);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      startCountdownSound();
      const countdown = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setIsFlipped(false);
      pauseCountdownSound();
    }
  }, [timer]);

  useEffect(() => {
    const updateLines = () => {
      setLines(prevLines =>
        prevLines.map((line, index) => ({
          ...line,
          active: index < activeLines,
        }))
      );
    };

    const moveToNextOpportunity = () => {
      if (opportunity < rounds.length - 1) {
        setSelectedOption(null);
        setIsLocked(false);
        setTimer(10);
        setRoundTimer(15);
        setIsFlipped(true);
        stopTickSound();
        startCountdownSound();
      } else {
        setFrozen(true);
        setCurrentRound(prev => prev + 1);
        playSound(gameOverBuffer, '/Sounds/fail.mp3');
        setRounds([
          { yesScore: 1000, noScore: 1000, nullScore: false, isPlayed: false },
          { yesScore: 1000, noScore: 1000, nullScore: false, isPlayed: false },
          { yesScore: 1000, noScore: 1000, nullScore: false, isPlayed: false },
        ]);
        toast.info("OOPS! You didn't qualify for the next round.");
      }
    };

    let countdown;
    if (roundTimer > 0 && timer === 0) {
      countdown = setInterval(() => {
        setRoundTimer(prev => prev - 1);
        startTickSound();
        updateLines();
      }, 1000);
    } else if (isLocked && roundTimer <= 0) {
      stopTickSound();
      updateScore();
      moveToNextOpportunity();
    } else if (!isLocked && roundTimer <= 0) {
      stopTickSound();
      updateNullScore();
      moveToNextOpportunity();
      toast.error("Oops! You didn't lock in your decision!");
    }

    return () => clearInterval(countdown);
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
        <Points currentRound={currentRound} />
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

      {frozen && <AnimatedText />}

      <div className="game-button-container game-flip-card">
        <div className={`game-flip-card-inner ${isFlipped ? "game-flipped" : ""}`}>
          {!frozen && !breakTie && (
            <div className="buttonsContainer">
              <button
                className="game_stroke_links game_single_button"
                onClick={handleYesClick}
              >
                Yes
              </button>
              <button
                className="game_stroke_links game_single_button"
                onClick={handleNoClick}
              >
                No
              </button>
              <div className="button_circle" onClick={lockInOption}>
                <div className="lines" id="lines">
                  {lines.map((line) => (
                    <div
                      key={line.id}
                      className={`line ${line.active ? "active" : ""}`}
                      style={{ transform: `rotate(${line.id * 6}deg) translateX(-50%)` }}
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