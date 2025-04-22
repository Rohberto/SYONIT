"use client"
import React, { useEffect, useState} from 'react';
import Header from '../Components/MainHeader/mainHeader';
import "./home.css";
import Points from '../Components/points';
import "swiper/css";
import "swiper/css/pagination";
import Round from '../Components/gameRound/gameRound';
import Bottom from '../Components/homeBottom';
import { useUser } from '../Context/userContext';
import { useRouter } from 'next/navigation';
import AnimatedSVG from '../Components/animateSvg';

const Home = () => {
  const labels = ['current game', 'Leaderboard', 'Prizes', 'History'];
  const [currentRound, setCurrentRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(20);
    const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();


  

  const [rounds, setRounds] = useState([
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
  ]);
  
  //check if all round has been played
  const allRoundsPlayed = rounds.every(round => round.isPlayed);

  const {user, prize} = useUser();
console.log(user);
  
  useEffect(() => {
    if (prize === null || timer <= 0) return;

    const Machine = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(Machine);
  }, [prize, timer, user]);
 
const formatTime = (secs) => {

  const mins = Math.floor(secs/60);
  const secsLeft = secs % 60;
  return `${mins.toString().padStart(2, '0')}: ${secsLeft.toString().padStart(2, '0')}`
}

return (
    <div className='home_container'>
        <Header/>
        <Points/>
      <div>
      <div className='Home_slide'>
      <div className='Home_screen'>
        <div className="current_game_header">GAME 0N</div>
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
      </div>
      </div>
    </div>

     {
      user === true && prize == null && (
        <p className='signed-in' style={{textAlign: "center"}}> You are successfully signed in</p>
      )
     }
  <AnimatedSVG/>
     {
      user == "true" && prize != null && timer > 0  ? (
        <h2 className='counting_down'>Countdown to Next Game: {formatTime(timer)}</h2>
      ) : ""
     }
{
   prize == null ? <Bottom/> : prize != null && timer > 0 ? (
    <div className="frozenHomeContainer" onClick={() => {
        setModalOpen(true);
    }}>
    <p className="frozen_text">Change My Prize</p>
  </div>
   ) : prize != null && timer <= 0 ? (
    <div className="frozenHomeContainer" onClick={() => router.push("/game")}>
    <p className="frozen_text">Click To Enter Game</p>
  </div>
   ) : ""
   }

{isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Are you sure you want to change your prize?</h2>
              <div className="modal-buttons">
                <button className="no-button" onClick={() => setModalOpen(false)}>
                  No
                </button>
                <button className="continue-button" onClick={() => router.push("/Prize")}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Home
