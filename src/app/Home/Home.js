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
import ThinkingCharacters from '../Components/animateSvg';
import Button from '../Components/syonit_button/homebutton';
import SignedButton from '../Components/syonit_button/loggedIn';
import ImageSlider from './ImagesSlider';
import PrizeButton from '../Components/syonit_button/prize';
import QuoteSlider from './quoteSlider';
import GameButton from '../Components/syonit_button/gamebutton';
import { playSound, getAudioContext } from '../libs/audioContext';

const Home = () => {
  const labels = ['current game', 'Leaderboard', 'Prizes', 'History'];
  const [currentRound, setCurrentRound] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [whistle, setWhistle] = useState(null);
  const [timer, setTimer] = useState(20);
  const [betweenTimer, setBetweenTimer] = useState(5);
  const [newTimer, setNewTimer] = useState(10);
    const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();


  

  const [rounds, setRounds] = useState([
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
    { yesScore: 1000, noScore: 1000, isPlayed: false },
  ]);

  //load game over whistle
   useEffect(() => {
      const ctx = getAudioContext();
      if (!ctx) {
        console.warn('Web Audio API not supported');
        return;
      }
  
      const loadSounds = async () => {
        try {
          const clickResponse = await fetch('/Sounds/siren.wav');
          if (!clickResponse.ok) throw new Error('Failed to fetch coin_drop.mp3');
          const clickArrayBuffer = await clickResponse.arrayBuffer();
          const clickAudioBuffer = await ctx.decodeAudioData(clickArrayBuffer);
          setWhistle(clickAudioBuffer);
  
       
        } catch (error) {
          console.error('Error loading sounds:', error);
        }
      };
  
      loadSounds();
    }, []);
  
  //check if all round has been played
  const allRoundsPlayed = rounds.every(round => round.isPlayed);

  const {user, prize, prizes} = useUser();

  
  useEffect(() => {
    if (prize === null || timer <= 0) return;

    const Machine = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(Machine);
  }, [prize, timer, user]);

  useEffect(() => {
    if (timer > 0 || betweenTimer <= 0) return;

    const Machine = setInterval(() => {
      setBetweenTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(Machine);
  }, [prize, timer, betweenTimer]);

  useEffect(() => {
    if (timer > 0 || betweenTimer > 0  || newTimer <= 0) return;

    const Machine = setInterval(() => {
      setNewTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(Machine);
  }, [prize, timer, betweenTimer, newTimer]);

  useEffect(() => {
   if (timer <= 0){
      if(whistle) {
        playSound(whistle, '/Sounds/siren.wav');
      }
    }
  }, [timer])
  
 
const formatTime = (secs) => {

  const mins = Math.floor(secs/60);
  const secsLeft = secs % 60;
  return `${mins.toString().padStart(2, '0')}: ${secsLeft.toString().padStart(2, '0')}`
}

return (
    <div className='home_container'>
        <Header/>
       {timer > 0 && (
        <p className='possible'>Almost there! Round 5 out of 7 </p>
       )}
       {timer === 0 && betweenTimer > 0 && (
        <p className='possible'>Game ID: SYON_004 OVER!!!<br/>
        NEW GAME STARTS.
        </p>
       )}
       {timer === 0 && betweenTimer <= 0 && (
        <p className='possible'>New Game ID: SYON_004 Starts!!!<br/>
        </p>
       )}
         {
       prize != null && timer === 0 && betweenTimer <= 0 && (
        <h2 className='counting_down'>Countdown to Next Game: {formatTime(newTimer)}</h2>
      ) 
    }
      <div>
      <div className='Home_slide'>
      <div className='Home_screen'>
        <div className="current_game_header">Ongoing Game</div>
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

     {/*
      user === true && prize == null && (
        <p className='signed-in' style={{textAlign: "center"}}> You are successfully signed in</p>
      )
     */}
     {
      prize === null && <ThinkingCharacters/>
     }

     {/*
       prize != null && timer > 0 && (
        <h2 className='counting_down'>Countdown to Next Game: {formatTime(timer)}</h2>
      ) 
    */ }
     {
       prize != null && timer > 0 && (
        <ImageSlider slides={prizes} prize={prize}/>
      ) 
     }
     {
       prize != null && timer <= 0 && (
        <QuoteSlider/>
      ) 
     }
{
   user === false &&  <div className='bottom_button'>
   <Button/>
   </div> 
} 
{prize === null && user === true  && timer >= 20 && (
 <div className='bottom_button'>
  <SignedButton/>
</div>
   ) }

{
       prize != null && timer > 0 && (
       <PrizeButton Modal={setModalOpen}/>
      ) 
     }
{
       prize != null && timer <= 0 && (
      <GameButton/>
      ) 
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
