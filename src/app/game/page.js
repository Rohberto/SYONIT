"use client"
import React, {useState,useRef, useEffect} from "react";
import "./GameConsole.css"; // Import the CSS file
import Header from "../Components/mainHeader";
import Points from "../Components/gamepoints";
import Round from "../Components/gameRound";

const GameConsole = () => {
    const clickSoundRef = useRef(null);
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
  return (
    <div className="game-console">
          <Header/>
      <div className="console-container">
        {/* Header */}
   

        {/* Round Info */}
        <div className="round-info">
          <h2>ROUND 1</h2>
        </div>

        {/* Player and Points */}
      <Points/>

<div className="game_blank_screen"></div>
     
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

         <div className='game-button-container'>
    <div className='buttonsContainer'>
      <button className='game_stroke_links onboarding_link_login onboarding_left game_single_button' onClick={() => {handleYesClick(); clickSoundRef.current.play()}} disabled={allRoundsPlayed}>Yes</button>
      <button className=' game_stroke_links onboarding_link_sign onboarding_right game_single_button' onClick={() => {handleNoClick(); clickSoundRef.current.play();}} disabled={allRoundsPlayed}>No</button>
      <div className='button_circle'>
      <div className="lines" id="lines" ref={circle}></div>
      </div>
    </div>
    </div>

    </div>
  );
};

export default GameConsole;
