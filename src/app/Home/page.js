"use client"
import React, { useState} from 'react';
import Header from '../Components/MainHeader/mainHeader';
import "./home.css";
import Points from '../Components/points';
import "swiper/css";
import "swiper/css/pagination";
import Round from '../Components/gameRound/gameRound';
import Bottom from '../Components/homeBottom';
import { useUser } from '../Context/userContext';

const Home = () => {
  const labels = ['current game', 'Leaderboard', 'Prizes', 'History'];
  const [currentRound, setCurrentRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  

  const [rounds, setRounds] = useState([
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
  ]);
  
  //check if all round has been played
  const allRoundsPlayed = rounds.every(round => round.isPlayed);

  const {user} = useUser();
 
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
      user && (
        <p className='signed-in' style={{textAlign: "center"}}> You are successfully signed in</p>
      )
     }

   <Bottom/>
    </div>
  )
}

export default Home
