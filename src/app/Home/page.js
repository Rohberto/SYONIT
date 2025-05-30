"use client"
import { useState, useEffect } from 'react';
import "./styles.css";
import { FaBook, FaBookOpen, FaFlagCheckered, FaHandsHelping, FaLightbulb, FaRegUser, FaUser } from 'react-icons/fa';
import {BsBook} from "react-icons/bs";
import Round from '../Components/Round';
import { getAudioContext, playSound } from '../libs/audioContext';
import "./page.css";
import {IoGameControllerSharp} from "react-icons/io5";
import { FcIdea } from 'react-icons/fc';
import Button from '../Components/syonit_button/mainButton';
export default function Home() {
  const [currentTab, setCurrentTab] = useState('game'); // Tabs: 'game', 'idea', 'leaderboard', 'special'
  const [points, setPoints] = useState(1834);
  const [currentGame, setCurrentGame] = useState(3);
    const [audioBuffer, setAudioBuffer] = useState(null);
  const [round, setRound] = useState(6);
  const [answers, setAnswers] = useState([true, false, null]); // Example: [true, false, null] for slots 1, 2, 3
  const [timeLeft, setTimeLeft] = useState(750); // 12:30 in seconds (12*60 + 30)
  const [currentRound, setCurrentRound] = useState(0);
  // Timer for the game
  useEffect(() => {
    if (currentTab === 'game' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentTab, timeLeft]);

  useEffect(() => {
      const ctx = getAudioContext();
      if (!ctx) {
        console.warn('Web Audio API not supported');
        return;
      }
  
      const loadSound = async () => {
        try {
          const response = await fetch('/Sounds/click_sound.wav');
          if (!response.ok) throw new Error('Failed to fetch click sound');
          const arrayBuffer = await response.arrayBuffer();
          const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
          setAudioBuffer(decodedBuffer);
        } catch (err) {
          console.error('Error loading click sound:', err);
        }
      };
  
      loadSound();
    }, []);
  
  
  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const [rounds, setRounds] = useState([
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
  ]);
  
  //check if all round has been played
  const allRoundsPlayed = rounds.every(round => round.isPlayed);

// Use refs to store the audio instances


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
    if (audioBuffer) {
                 playSound(audioBuffer, '/Sounds/click_sound.wav');
               }
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
    if (audioBuffer) {
                 playSound(audioBuffer, '/Sounds/click_sound.wav');
               }
    setRounds(prevRounds =>
      prevRounds.map((round, index) =>
        index === currentRound
          ? { ...round, noScore: round.noScore + 1 }
          : round
      )
    );
    handleNextRound();
  };

   // Determine if "Yes" or "No" has the highest score for a given round
   const getHighestScore = (yesScore, noScore) => {
    if (yesScore > noScore) return 'Yes';
    else if (noScore > yesScore) return 'No';
    return 'Tie';
  };



  const renderContent = () => {
    switch (currentTab) {
      case 'game':
        return (
                 <div className='Home_slide'>
                 <h1>Current Game</h1>
      <div className='Home_screen'>
        <div className="current_game_info_buttons">
        <div className='game_info'>
        <h4>Players</h4>
        <p>1,000,000</p>
        </div>
        <div className='game_info'>
        <h4>Opportunity</h4>
        <p>3</p>
        </div>
        <div className='game_info'>
        <h4>Round</h4>
        <p>2</p>
        </div>
        <div className='divider'></div>
        </div>
      
        <div className="game">

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

        <div className='game_buttons'>
          <button className='game_button y_button'  onClick={handleYesClick} disabled={allRoundsPlayed}>Y</button>
          <button className='game_button y_button' onClick={handleNoClick} disabled={allRoundsPlayed}>N</button>
        </div>
      </div>
      </div>
        );
      case 'idea':
        return (
          <div className="idea-container">
            <h3>Motivation</h3>
            <p>
              "In any moment of decision, the best thing you can do is the right thing, the next best thing is the wrong thing, and the worst thing you can do is nothing."
            </p>
            <p className="quote-author">— Theodore Roosevelt</p>
          </div>
        );
      case 'leaderboard':
        return (
          <div className="leaderboard-container">
            <h3>Leaderboard</h3>
            <div className="leaderboard-header">
              <div>RANK</div>
              <div>NAME</div>
              <div>POINTS</div>
            </div>
            {/* Placeholder for leaderboard */}
            <p>No leaderboard data available.</p>
          </div>
        );
      case 'special':
        return (
          <div className="special-container">
            <h3>Upcoming Special Events</h3>
            {/* Placeholder for special events */}
            <p>No upcoming events at the moment.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="gameContainer">
      <div className="header-section">
        <div className="profile-icon"><FaRegUser/><span className='online'></span></div>
        <h1 className="header">SYONIT</h1>
        <div className="book-icon"><BsBook/></div>
      </div>
      <div className="points-section">
        <div className='points-container'>
            <p><span>POINTS: </span>{points}</p>
            <p>2,500 <span> :PRIZE</span></p>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(points / 2500) * 100}%` }}></div>
        </div>
      </div>
      {renderContent()}
      <div className="nav-buttons">
        <button
          className={`nav-button ${currentTab === 'game' ? 'active' : ''}`}
          onClick={() => setCurrentTab('game')}
        >
         <IoGameControllerSharp/>
        </button>
        <button
          className={`nav-button ${currentTab === 'idea' ? 'active' : ''}`}
          onClick={() => setCurrentTab('idea')}
        >
        <FaLightbulb/>
        </button>
        <button
          className={`nav-button ${currentTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('leaderboard')}
        >
          <FaFlagCheckered/>
        </button>
        <button
          className={`nav-button ${currentTab === 'special' ? 'active' : ''}`}
          onClick={() => setCurrentTab('special')}
        >
          <FaHandsHelping/>
        </button>
      </div>
      <div className="bottom-button">
      <div className='game_details'>
        <p>ONLINE: 3</p>
        <p>1: IN GAME</p>
      </div>
      <Button formatTime={formatTime} timeLeft={timeLeft}/>
      </div>
    </div>
  );
}