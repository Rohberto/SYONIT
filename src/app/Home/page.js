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
import Header from '../Components/MainHeader';
import { useSocket } from '../Context/SocketContext';
import { useUser } from '../Context/userContext';
import { useTournament } from '../Context/tournament';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('game'); // Tabs: 'game', 'idea', 'leaderboard', 'special'
  const [points, setPoints] = useState(1834);
  const [currentGame, setCurrentGame] = useState(3);
    const [audioBuffer, setAudioBuffer] = useState(null);
  const [round, setRound] = useState(6);
  const [answers, setAnswers] = useState([true, false, null]); // Example: [true, false, null] for slots 1, 2, 3
  const [timeLeft, setTimeLeft] = useState(0); // 12:30 in seconds (12*60 + 30)
  const [currentRound, setCurrentRound] = useState(0);
  const {socket, tournament, setTournament, noOfPlayers, setNoOfPlayers} = useSocket();
  const [joined, setJoined] = useState(false);
  const [breakATie, setBreakATie] = useState(false)
  const [tournamentId, setTournamentId] = useState(null);
const {user} = useUser();
const {setGameTimer} = useTournament();
const router = useRouter();

    useEffect(() => {
    if (!socket) return;

    console.log("Homepage", tournament);
    socket.on("tournament:created", (data) => {
     setTournament(data);
    });

    socket.on("tournament:newPlayer", (data) => {
     console.log(data);
    });

    socket.on("vote:error", (err) => {
      console.error("Vote error:", err.message);
    });
     const onJoined = ({ tid, room }) => {
      // server confirmed room join
      setJoined(true);
      console.log(`✅ Joined room ${room} for tournament ${tid}`);
    };

    const onError = (payload) => {
      console.warn('❌ tournament:error', payload?.message || payload);
      setJoined(false);
    };

    
    const onStarted = ({ tid }) => {
      console.log("did it kickstart");
      console.log(tournament);
      // only navigate if this tournament is the one on the screen
      const currentTid = tournament?.tid;
      console.log(currentTid);
      console.log("tid", tid);
      if (!currentTid) return;
      if (tid === currentTid) {
        console.log('✅ Tournament started, moving to game…');
        router.push(`/game`);
      }
    };

    const onCancelled = ({ tid }) => {
      const currentTid = tournament?.tid ?? tournament?.id;
      if (tid === currentTid) {
        console.log('⚠️ Tournament cancelled');
        setJoined(false);
      }
    };

    socket.on('tournament:joined', onJoined);
    socket.on('tournament:error', onError);
    //socket.on('tournament:started', onStarted);   // <-- matches your backend emit name
    socket.on('tournament:cancelled', onCancelled);
    socket.on('tournament-starting', (data) => {
      console.log(data);
      toast.info(`Tournament starting in ${data.startsIn / 1000}s...`);
      setNoOfPlayers(data.playersCount);
       setGameTimer(data.startsIn);
         router.push(`/game/${data.tid}`);
      });

    return () => {
      socket.off("vote:cast");
      socket.off("vote:error");
      socket.off('tournament:joined', onJoined);
      socket.off('tournament:error', onError);
      socket.off('tournament:cancelled', onCancelled);
      socket.off('tournament-starting');
    };
  }, [socket, tournament]);



  // ⏳ Set initial timeLeft from tournament
useEffect(() => {
  if (!tournament || !tournament.lobbyEndsAt) return;

  const endTime = new Date(tournament.lobbyEndsAt).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((endTime - now) / 1000));

  setTimeLeft(diff);
}, [tournament]);

useEffect(() => {
  if (!tournament || tournament.status !== "waiting" || timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => Math.max(0, prev - 1));
  }, 1000);

  return () => clearInterval(timer);
}, [tournament, timeLeft]);


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

    useEffect(() => {

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

  //Break a tie handler
  const handleBreakATie = () => {
    // Logic to break the tie, e.g., open a modal or navigate to a tie-breaking screen
   socket.emit("tie:attempt", { tid: tournamentId, userId: user.id });

    toast.info("Tie-breaking process initiated.");
    setBreakATie(false); // Hide the button after initiating tie-break
  };



  const renderContent = () => {
    switch (currentTab) {
      case 'game':
        return (
          <>
           <h3>Current Game</h3>
                 <div className='Home-slide'>
   
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
      </>
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
    <div className='glassy-panel'>
      <Header/>
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

      {<Button formatTime={formatTime} timeLeft={timeLeft} tournament={tournament} user={user} joined={joined} setJoined={setJoined}/>}
      </div>
      </div>
    </div>
  );
}