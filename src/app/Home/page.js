"use client"
import React, { useState, useEffect, useRef } from 'react';
import Header from '../Components/mainHeader';
import "./home.css";
import Points from '../Components/points';
import "swiper/css";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from "swiper/modules";
import Round from '../Components/Round';
import Bottom from '../Components/homeBottom';

const Home = () => {
  const labels = ['current game', 'Leaderboard', 'Prizes', 'History'];
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState([
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
  ]);
  
  //check if all round has been played
  const allRoundsPlayed = rounds.every(round => round.isPlayed);

// Use refs to store the audio instances
const clickSoundRef = useRef(null);
const gameplaySoundRef = useRef(null);

useEffect(() => {
  clickSoundRef.current = new Audio('Sounds/click_sound.wav');
  clickSoundRef.current.load();
  gameplaySoundRef.current = new Audio('/Sounds/game_sound.mp3');
  gameplaySoundRef.current.loop = true; // Loop the background sound

  // Play the gameplay sound
  gameplaySoundRef.current.play();

  // Cleanup to pause sound when component unmounts
  return () => {
    gameplaySoundRef.current.pause();
  };
}, []);

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
    clickSoundRef.current.play();
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
    clickSoundRef.current.play();
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

  return (
    <div className='home_container'>
        <Header/>
        <Points/>

        {
          /*screen */
        }
            {/* slider  Content */}
   <Swiper 
   grabCursor={true}
   centeredSlides={true}
   slidesPerView={1}
   spaceBetween={20}
   modules={[Pagination]}
      pagination={{
        clickable: true,
        renderBullet: (index, className) => {
          return `
            <div class="custom-pagination-bullet">
              <span class="bullet-label">${labels[index]}</span>
              <span class="${className}"></span>
            </div>
          `;
        },
      }}
  className='swiper_container' >
    <SwiperSlide>
      <div className='Home_slide'>
      <div className='Home_screen'>
        <div className="current_game_header">CURRENT GAME</div>
        <div className="current_game_info_buttons">
          <p>N.O.P: 4000</p>
          <p>OPP 3</p>
          <p>Round {currentRound}</p>
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
    </SwiperSlide>
    <SwiperSlide>
      <div className='Home_slide'>
      <div className='Home_screen'>

      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a mind game about decision making.</span></p>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className='Home_slide'>
      <div className='Home_screen'>

      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a mind game about decision making.</span></p>
      </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className='Home_slide'>
      <div className='Home_screen'>

      </div>
      <p>SIMPLE YES OR NO <span className='small_slide_text'>is a mind game about decision making.</span></p>
      </div>
    </SwiperSlide>
   
   </Swiper>

   <Bottom/>
    </div>
  )
}

export default Home
