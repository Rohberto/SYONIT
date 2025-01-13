"use client"
import React, {useState,useRef, useEffect} from "react";
import "./GameConsole.css"; // Import the CSS file
import Header from "../Components/MainHeader/mainHeader";
import Points from "../Components/gamepoints";
import Round from "../Components/gameRound/gameRound";

const GameConsole = () => {
    const clickSoundRef = useRef(null);
    const [timer, setTimer] = useState(10); // Timer duration in seconds
    const [isFlipped, setIsFlipped] = useState(false); 
    useEffect(() => {
      clickSoundRef.current = new Audio('Sounds/click_sound.wav');
      clickSoundRef.current.load();
    }, []);
  const [rounds, setRounds] = useState([
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
  ]);
  const [currentRound, setCurrentRound] = useState(0);
  
  const handleNextRound = () => {
    // Mark the current round as played
    setRounds(prevRounds =>
      prevRounds.map((round, index) =>
        index === currentRound
          ? { ...round, isPlayed: true }
          : round
      )
    );

    // Move to the next round if it's not the last round
    if (currentRound < rounds.length - 1) {
      setCurrentRound(prevRound => prevRound + 1);
    }
  };
  const handleYesClick = () => {
    setRounds(prevRounds =>
      prevRounds.map((round, index) =>
        index === currentRound
          ? { ...round, yesScore: round.yesScore + 1 }
          : round
      )
    );
    handleNextRound();
  };

  const handleNoClick = () => {
    setRounds(prevRounds =>
      prevRounds.map((round, index) =>
        index === currentRound
          ? { ...round, noScore: round.noScore + 1 }
          : round
      )
    );
    handleNextRound();
  };
  const allRoundsPlayed = rounds.every(round => round.isPlayed);
  
    const circle = useRef();
      useEffect(() => {
        for (let i = 0; i < 60; i++) {
          const line = document.createElement('div');
          line.classList.add('line');
          line.style.transform = `rotate(${i * 6}deg) translateX(-50%)`;
          circle.current.appendChild(line);
        }
      }, []);

      useEffect(() => {
        if (timer > 0) {
          const countdown = setInterval(() => {
            setTimer((prev) => prev - 1);
          }, 1000);
    
          return () => clearInterval(countdown); // Cleanup on unmount or state update
        } else {
          setIsFlipped(true); // Flip card when timer ends
        }
      }, [timer]);
      const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60); // Get whole minutes
        const remainingSeconds = totalSeconds % 60; // Get remaining seconds
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`; // Format as mm:ss
      };

  return (
    <div className="game-console">
          <Header/>
      <div className="console-container">
        {/* Header */}
   

        {/* Round Info 
        <div className="round-info">
        <p>Next Game:</p>
        <h2>9:43</h2>
          <h2>ROUND 1</h2>
  </div>
      */}

        {/* Player and Points */}
      <Points/>


     
      {rounds.map((round, index) => (
        <Round
          key={index}
          round={index + 1}
          yesScore={round.yesScore}
          noScore={round.noScore}
          isPlayed={round.isPlayed}
          isActive={index === currentRound}
         currentRound={currentRound} 
        />
      ))}
      </div>

         <div className='game-button-container flip-card '>
         <div
        className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}
      >
    <div className="flip-card-back">
         <h1 className="big_timer">{formatTime(timer)}</h1>
          <p>Count down to next game</p>
    </div>

    <div className='buttonsContainer'>
      <button className='game_stroke_links onboarding_link_login onboarding_left game_single_button' onClick={() => {handleYesClick(); clickSoundRef.current.play()}} disabled={allRoundsPlayed}>Yes</button>
      <button className=' game_stroke_links onboarding_link_sign onboarding_right game_single_button' onClick={() => {handleNoClick(); clickSoundRef.current.play();}} disabled={allRoundsPlayed}>No</button>
      <div className='button_circle'>
      <div className="lines" id="lines" ref={circle}></div>
      </div>
    </div>
    </div>
</div>
    </div>
  );
};

export default GameConsole;
