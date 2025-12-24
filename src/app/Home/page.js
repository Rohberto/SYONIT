"use client";
import { useState, useEffect, useRef, use } from "react";
import "./styles.css";
import { FaFlagCheckered, FaHandsHelping, FaLightbulb } from "react-icons/fa";
import { IoGameControllerSharp } from "react-icons/io5";
import Button from "../Components/syonit_button/mainButton";
import Header from "../Components/MainHeader";
import { useSocket } from "../Context/SocketContext";
import { useUser } from "../Context/userContext";
import { useRouter } from "next/navigation";
import Round from "../Components/Round";
import { getAudioContext, playSound } from "../libs/audioContext";
import Results from "../game/[tournamentId]/Results";
import "./page.css";
import MessageModal from "../Components/MessageModal";
import { toast } from "react-toastify";
import SlidingQuotes from "../Components/Quotes";
import { useOnboarding } from "../Context/OnboardingContext";
import SpotlightOverlay from "../Components/Game_Assistant/SpotlightOverlay";
import SimpleTooltip from "../Components/Game_Assistant/SimpleTooltip";
import { HomeSteps } from "../libs/onboardingSteps";
import {jwtDecode} from "jwt-decode";
import PrizeSelectionUI from "../Components/Prize/PrizeModal";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("game");
  const [points, setPoints] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [opportunityNumber, setOpportunityNumber] = useState(0);
  const [roundTimer, setRoundTimer] = useState(0);
  const [results, setResults] = useState({ 1: null, 2: null, 3: null });
  const [showVoteResultOverlay, setShowVoteResultOverlay] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [sirenBuffer, setSirenBuffer] = useState(null);
  const [bgMusicBuffer, setBgMusicBuffer] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioSourceRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { socket, tournament, noOfPlayers, onlineCount, timeLeft, formatTime, setNoOfPlayers } = useSocket();
  const { user, loading, userPrize, selectedPrize } = useUser();
  const router = useRouter();
  const opportunityRef = useRef(opportunityNumber);
  const [prizeModalOpen, setPrizeModalOpen] = useState(false);

  //gamehelp
  const { start } = useOnboarding();


 useEffect(() => {
    const seen = localStorage.getItem('syonit_onboarding_seen_home');
    if (!seen) {
      start(HomeSteps, {
      onComplete: () => {
        // Set localStorage AFTER onboarding finishes
        localStorage.setItem('syonit_onboarding_seen_home', 'true');
        // Dispatch event to trigger prize modal check
        window.dispatchEvent(new Event('localStorageChange'));
      },
      onSkip: () => {
        // Also handle if user skips
        localStorage.setItem('syonit_onboarding_seen_home', 'true');
        window.dispatchEvent(new Event('localStorageChange'));
      }
    });
      localStorage.setItem('syonit_onboarding_seen_home', 'true');
    }
  }, []);

useEffect(() => {
  // Function to check and open modal
  const checkAndOpenModal = () => {
    const seen = localStorage.getItem('syonit_onboarding_seen_home');
    console.log("Checking modal conditions:", { seen, userPrize });
    
    if (seen && userPrize && userPrize.prizeId === null) {
      setPrizeModalOpen(true);
    }
  };

  // Check immediately
  checkAndOpenModal();

  // Listen for storage changes (works across tabs)
  window.addEventListener('storage', checkAndOpenModal);

  // Listen for custom event (works in same tab)
  window.addEventListener('localStorageChange', checkAndOpenModal);

  // Cleanup
  return () => {
    window.removeEventListener('storage', checkAndOpenModal);
    window.removeEventListener('localStorageChange', checkAndOpenModal);
  };
}, [userPrize]);

  // Show modal with message
  const showModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setModalMessage("");
  };
  
  useEffect(() => {
    opportunityRef.current = opportunityNumber;
  }, [opportunityNumber]);

  // Navigation: Redirect to login if not logged in
  useEffect(() => {
    if (loading) return; // Wait for localStorage check
    if (!user || !user.id) {
      console.log("User not signed in, redirecting to /login");
      router.push("/login");
    }
  }, [user, loading, router]);


  // Load audio
  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) {
      console.warn("Web Audio API not supported");
      return;
    }

    const loadSound = async () => {
      try {
        const clickRes = await fetch("/Sounds/click_sound.wav");
        if (!clickRes.ok) throw new Error("Failed to fetch click sound");
        const clickBuf = await clickRes.arrayBuffer();
        setAudioBuffer(await ctx.decodeAudioData(clickBuf));

        const sirenRes = await fetch("/Sounds/siren.wav");
        if (!sirenRes.ok) throw new Error("Failed to fetch siren sound");
        const sirenBuf = await sirenRes.arrayBuffer();
        setSirenBuffer(await ctx.decodeAudioData(sirenBuf));

        const bgMusicRes = await fetch("/Sounds/SYON.mp3");
        if (!bgMusicRes.ok) throw new Error("Failed to fetch background music");
        const bgMusicBuf = await bgMusicRes.arrayBuffer();
        setBgMusicBuffer(await ctx.decodeAudioData(bgMusicBuf));
      } catch (err) {
        console.error("Error loading sounds:", err);
      }
    };

    loadSound();
  }, []);

  // Play background music
  useEffect(() => {
    if (!bgMusicBuffer || !user || !user.id) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    const playBackgroundMusic = () => {
      if (audioSourceRef.current) return;
      audioSourceRef.current = ctx.createBufferSource();
      audioSourceRef.current.buffer = bgMusicBuffer;
      audioSourceRef.current.loop = true;
      audioSourceRef.current.connect(ctx.destination);
      audioSourceRef.current.start(0);
      setIsMusicPlaying(true);
      console.log("🎵 Background music started");
    };

    playBackgroundMusic();

    return () => {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
        setIsMusicPlaying(false);
        console.log("🎵 Background music stopped");
      }
    };
  }, [bgMusicBuffer, user]);

  // Socket events
  useEffect(() => {
    if (!socket?.connected || !user) return;

    const joinLobby = () => {
      if (currentTab === "game") {
        socket.emit("joinLobby");
        console.log("✅ Joined lobby room");
      } else {
        socket.emit("leaveLobby");
        console.log("✅ Left lobby room");
      }
    };

    joinLobby();

    const handleRoundStarted = ({ roundNumber }) => {
      setCurrentRound(roundNumber);
      setResults({ 1: null, 2: null, 3: null });
      setOpportunityNumber(0);
    };

    const handleOpportunityStarted = ({ opportunityNumber, endsAt }) => {
      setOpportunityNumber(opportunityNumber);
      if (sirenBuffer) playSound(sirenBuffer, "/Sounds/siren.wav");
      setResults((prev) => ({
        ...prev,
        [opportunityNumber]: null,
      }));
      const msLeft = new Date(endsAt).getTime() - Date.now();
      setRoundTimer(Math.floor(msLeft / 1000));
    };

    const handleOpportunityEnded = ({ yesVotes, noVotes, minority, voters }) => {
      setResults((prev) => ({
        ...prev,
        [opportunityRef.current]: {
          yesVotes: yesVotes ?? 0,
          noVotes: noVotes ?? 0,
          minority: minority ?? "none",
        },
      }));
     // setShowVoteResultOverlay({ voters, yesVotes, noVotes, minority });
    //  setTimeout(() => setShowVoteResultOverlay(null), 5000);
    };

    const handleRoundEnded = () => {};

    const handleTournamentEnded = ({ tid, winnerId, winnerName }) => {
      console.log(`🏆 Tournament ${tid} ended. Winner: ${winnerName} (ID: ${winnerId})`);
      setGameOver(true);
      setWinner(winnerName || "No Winner");
    };

    const handleTournamentNewPlayer = () => {
      if (tournament?.tid) {
        socket.emit("getPlayerCount", { tid: tournament.tid });
      }
    };

    const handlePlayerCount = ({ playersCount }) => {
      setNoOfPlayers(playersCount);
    };

    const handleTournamentStarting = ({ startsIn }) => {
      console.log(`🚀 New tournament starting in ${startsIn / 1000}s`);
      setGameOver(false);
      setWinner(null);
      setCurrentRound(0);
      setOpportunityNumber(0);
      setResults({ 1: null, 2: null, 3: null });
      setRoundTimer(Math.floor(startsIn / 1000));
    };

    socket.on("tournament:starting", handleTournamentStarting);
    socket.on("round:started", handleRoundStarted);
    socket.on("opportunity:started", handleOpportunityStarted);
    socket.on("opportunity:ended", handleOpportunityEnded);
    socket.on("round:ended", handleRoundEnded);
    socket.on("tournament:ended", handleTournamentEnded);
    socket.on("tournament:newPlayer", handleTournamentNewPlayer);
    socket.on("tournament:playerCount", handlePlayerCount);

    return () => {
      socket.off("tournament:starting", handleTournamentStarting);
      socket.off("round:started", handleRoundStarted);
      socket.off("opportunity:started", handleOpportunityStarted);
      socket.off("opportunity:ended", handleOpportunityEnded);
      socket.off("round:ended", handleRoundEnded);
      socket.off("tournament:ended", handleTournamentEnded);
      socket.off("tournament:newPlayer", handleTournamentNewPlayer);
      socket.off("tournament:playerCount", handlePlayerCount);
      socket.emit("leaveLobby");
    };
  }, [socket, currentTab, sirenBuffer, tournament?.tid, setNoOfPlayers, user]);

  useEffect(() => {
    if (roundTimer <= 0) return;
    const interval = setInterval(() => {
      setRoundTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [roundTimer]);

  //token checker

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    // decoded.exp is in seconds, Date.now() is in ms
    if (decoded.exp * 1000 < Date.now()) {
      // Token expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  } catch (e) {
    // Invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }
}, [router]);

  const toggleMusic = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (isMusicPlaying) {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
        setIsMusicPlaying(false);
        console.log("🎵 Background music paused");
      }
    } else {
      if (bgMusicBuffer) {
        audioSourceRef.current = ctx.createBufferSource();
        audioSourceRef.current.buffer = bgMusicBuffer;
        audioSourceRef.current.loop = true;
        audioSourceRef.current.connect(ctx.destination);
        audioSourceRef.current.start(0);
        setIsMusicPlaying(true);
        console.log("🎵 Background music resumed");
      }
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      
case "game":
  return (
    <>
      <h3>
        {!tournament || currentRound === 0
          ? "Waiting for the next game to start..."
          : "Current Game"}
      </h3>
      <div className="Home-slide">
        {tournament || currentRound !== 0 ? (
          <>
            <div className="current_game_info_buttons">
              <div className="game_info">
                <h4>Players</h4>
                <p>{noOfPlayers || "N/A"}</p>
              </div>
              <div className="game_info">
                <h4>Opportunity</h4>
                <p>{opportunityNumber || 0}</p>
              </div>
              <div className="game_info">
                <h4>Round</h4>
                <p>{currentRound || 0}</p>
              </div>
              <div className="game_info">
                <h4>Time Left</h4>
                <p>{roundTimer > 0 ? `${roundTimer}s` : "N/A"}</p>
              </div>
              <div className="divider"></div>
            </div>
          </>
        ) : null}

        {!tournament || currentRound === 0 ? (
          <SlidingQuotes />
        ) : gameOver ? (
          <div className="game-over">
            <h2>Game Over</h2>
            <p>Winner: {winner || "N/A"}</p>
            <button onClick={() => router.push("/Home")}>Go Home</button>
          </div>
        ) : (
          <>
            {showVoteResultOverlay && <Results results={showVoteResultOverlay} />}
            <div className="game">
              {[1, 2, 3].map((opp) => {
                const roundResult = results[opp];
                return (
                  <Round
                    key={opp}
                    round={opp}
                    yesScore={roundResult ? roundResult.yesVotes : 0}
                    noScore={roundResult ? roundResult.noVotes : 0}
                    isPlayed={!!roundResult}
                    isActive={opportunityNumber === opp}
                    currentRound={currentRound}
                    minority={roundResult ? roundResult.minority : null}
                    roundId={opp}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
      case "idea":
        return (
          <div className="idea-container">
            <h3>Motivation</h3>
            <p>
              "In any moment of decision, the best thing you can do is the right thing, the next best thing is the wrong thing, and the worst thing you can do is nothing."
            </p>
            <p className="quote-author">— Theodore Roosevelt</p>
          </div>
        );
      case "leaderboard":
        return (
          <div className="leaderboard-container">
            <h3>Leaderboard</h3>
            <div className="leaderboard-header">
              <div>RANK</div>
              <div>NAME</div>
              <div>POINTS</div>
            </div>
            <p>No leaderboard data available.</p>
          </div>
        );
      case "special":
        return (
          <div className="special-container">
            <h3>Upcoming Special Events</h3>
            <p>No upcoming events at the moment.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <SpotlightOverlay />
    {prizeModalOpen && <PrizeSelectionUI onClose={() => setPrizeModalOpen(false)} />}
    <div className="homeContainer">
      <Header />
      <div className="points-section" data-guide="points">
        <div className="points-container">
          <p>
            <span>POINTS: </span>
            {userPrize?.points}
          </p>
          <p>
            {selectedPrize?.pointsRequired} <span>:PRIZE</span>
          </p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(userPrize?.points / selectedPrize?.pointsRequired) * 100}%` }}></div>
        </div>
      </div>
      {user && (
        <div className="music-toggle">
          <button onClick={toggleMusic}>
            {isMusicPlaying ? "Mute Music" : "Play Music"}
          </button>
        </div>
      )}
      <div data-guide="game">
      {renderContent()}
      </div>
      <div className="nav-buttons">
        <button
          className={`nav-button ${currentTab === "game" ? "active" : ""}`}
          onClick={() => setCurrentTab("game")}
        >
          <IoGameControllerSharp />
        </button>
        <button
          className={`nav-button ${currentTab === "idea" ? "active" : ""}`}
          onClick={() => setCurrentTab("idea")}
        >
          <FaLightbulb />
        </button>
        <button
          className={`nav-button ${currentTab === "leaderboard" ? "active" : ""}`}
          onClick={() => setCurrentTab("leaderboard")}
        >
          <FaFlagCheckered />
        </button>
        <button
          className={`nav-button ${currentTab === "special" ? "active" : ""}`}
          onClick={() => setCurrentTab("special")}
        >
          <FaHandsHelping />
        </button>
      </div>
      <div className="bottom-button" data-guide="timer">
        <div className="game_details">
          <p>ONLINE: {onlineCount}</p>
          <p>{tournament ? "1: IN GAME" : "0: IN GAME"}</p>
        </div>
        <Button formatTime={formatTime} timeLeft={timeLeft} tournament={tournament} user={user} />
      </div>
      <MessageModal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={closeModal}
        autoDismiss={5000} // Auto-close after 5s
      />
    </div>
    </>
  );
}