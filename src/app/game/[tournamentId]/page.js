"use client";
import { useRef, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/app/Context/SocketContext";
import { useUser } from "@/app/Context/userContext";
import Header from "@/app/Components/MainHeader";
import Round from "@/app/Components/TournamentRound";
import { getAudioContext, playSound } from "@/app/libs/audioContext";
import PrizeChangeModal from "@/app/Components/PrizeChangeModal";
import confetti from "canvas-confetti";
import "./game.css";
import { toast } from "react-toastify";
import Results from "./Results";

const GameConsole = () => {
  const router = useRouter();
  const { socket, noOfPlayers, prizeWindow } = useSocket();
  const { tournamentId } = useParams();
  const { user } = useUser();

  const [userId, setUserId] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [opportunityId, setOpportunityId] = useState(null);
  const [opportunityNumber, setOpportunityNumber] = useState(0);
  const [roundTimer, setRoundTimer] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [results, setResults] = useState({ 1: null, 2: null, 3: null });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [celebrationBuffer, setCelebrationBuffer] = useState(null);
  const [sirenBuffer, setSirenBuffer] = useState(null);
  const [lastVote, setLastVote] = useState(null);
  const [scores, setScores] = useState(0);
  const [isEliminated, setIsEliminated] = useState(false);
  const [showTieBreaker, setShowTieBreaker] = useState(false);
  const [option, setOption] = useState(null);
  const [showVoteResultOverlay, setShowVoteResultOverlay] = useState(null);
  // New state to track if vote has been submitted
  const [hasVoted, setHasVoted] = useState(false);

  const opportunityRef = useRef(opportunityNumber);

  const handleSelectOption = (option) => {
    setOption(option);
    toast.success("Click on the center button to lock your decision.");
    if (audioBuffer) playSound(audioBuffer, "/Sounds/click_sound.wav");
  };

  useEffect(() => {
    opportunityRef.current = opportunityNumber;
  }, [opportunityNumber]);

  useEffect(() => {
    if (user !== null) {
      setUserId(user.id);
      console.log("User ID set to:", user.id);
    }
  }, [user]);

  useEffect(() => {
    if (!socket || !socket.connected || !tournamentId || !userId) {
      console.log("Socket not ready:", { socket: !!socket, connected: socket?.connected, tournamentId, userId });
      return;
    }

    console.log(`🎮 Joining tournament ${tournamentId} for user ${userId}, socket ID: ${socket.id}`);
    socket.emit("checkParticipation", { tid: tournamentId, userId });

    const handleTournamentStarting = ({ startsIn }) => {
      console.log(`🚀 Tournament starting in ${startsIn / 1000}s`);
      setRoundTimer(startsIn / 1000);
      setIsVoting(false);
    };

    const handleRoundStarted = ({ roundNumber }) => {
      console.log(`🔄 Round ${roundNumber} started`);
      setCurrentRound(roundNumber);
      setResults({ 1: null, 2: null, 3: null });
      setOpportunityNumber(0);
    };

    const handleOpportunityStarted = ({ oid, opportunityNumber, endsAt }) => {
      console.log(`🎯 Opportunity ${opportunityNumber} started, oid: ${oid}`);
      setOpportunityId(oid);
      setOpportunityNumber(opportunityNumber);
      if (sirenBuffer) playSound(sirenBuffer, "/Sounds/celebration.wav");
      setIsVoting(true);
      setLastVote(null);
      setHasVoted(false); // Reset hasVoted for new voting opportunity
      setResults((prev) => ({
        ...prev,
        [opportunityNumber]: null,
      }));
      const msLeft = new Date(endsAt).getTime() - Date.now();
      setRoundTimer(Math.floor(msLeft / 1000));
    };

    const handleOpportunityEnded = ({ voters, yesVotes, noVotes, minority }) => {
      console.log(`🏁 Opportunity ${opportunityRef.current} ended`, { yesVotes, noVotes, minority });
      setIsVoting(false);
      setResults((prev) => ({
        ...prev,
        [opportunityRef.current]: {
          yesVotes: yesVotes ?? 0,
          noVotes: noVotes ?? 0,
          minority: minority ?? "none",
        },
      }));
      setShowVoteResultOverlay({ voters, yesVotes, noVotes, minority });
      setTimeout(() => setShowVoteResultOverlay(null), 5000);
      if (lastVote) {
        if (lastVote === minority) {
          if (celebrationBuffer) playSound(celebrationBuffer, "/Sounds/celebration.wav");
        } else {
          toast.warn("Oops, you are not in the minority!");
        }
      }
    };

    const handleRoundEnded = () => {
      console.log("🔚 Round ended");
      setIsVoting(false);
    };

    const handlePlayerEliminated = ({ message, tournamentId: tid }) => {
      console.log(`🚫 Player eliminated: ${message}`);
      setIsEliminated(true);
    };

    const handleTieBreaker = () => {
      console.log("🔥 Tie-breaker opportunity opened");
      setShowTieBreaker(true);
    };

    const handleTournamentEnded = ({ tid, winnerId, winnerName }) => {
      console.log(`🏆 Tournament ${tid} ended. Winner: ${winnerName} (ID: ${winnerId})`);
      setGameOver(true);
      setWinner(winnerName || "No Winner");
      setIsWinner(userId && userId === winnerId);
      setIsEliminated(false);
      setShowTieBreaker(false);
    };

    const handleScoreUpdated = ({ score, playerId }) => {
      if (playerId === userId) {
        console.log(`📊 Score updated for user ${userId}: ${score}`);
        setScores(score);
      }
    };

    socket.on("tournament:starting", handleTournamentStarting);
    socket.on("round:started", handleRoundStarted);
    socket.on("opportunity:started", handleOpportunityStarted);
    socket.on("opportunity:ended", handleOpportunityEnded);
    socket.on("round:ended", handleRoundEnded);
    socket.on("player:eliminated", handlePlayerEliminated);
    socket.on("tie:breaker", handleTieBreaker);
    socket.on("tournament:ended", handleTournamentEnded);
    socket.on("score:updated", handleScoreUpdated);

    return () => {
      socket.off("tournament:starting", handleTournamentStarting);
      socket.off("round:started", handleRoundStarted);
      socket.off("opportunity:started", handleOpportunityStarted);
      socket.off("opportunity:ended", handleOpportunityEnded);
      socket.off("round:ended", handleRoundEnded);
      socket.off("player:eliminated", handlePlayerEliminated);
      socket.off("tie:breaker", handleTieBreaker);
      socket.off("tournament:ended", handleTournamentEnded);
      socket.off("score:updated", handleScoreUpdated);
    };
  }, [socket, tournamentId, userId, lastVote, celebrationBuffer, sirenBuffer]);

  useEffect(() => {
    if (roundTimer <= 0) return;
    const interval = setInterval(() => {
      setRoundTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [roundTimer]);

  const handleVote = (choice) => {
    if (!opportunityId || !isVoting || !choice || hasVoted) return;
    console.log(`🗳️ Casting vote: ${choice} for opportunity ${opportunityId}`);
    setLastVote(choice);
    setHasVoted(true); // Disable voting until next opportunity
    socket.emit("vote", {
      tid: tournamentId,
      opportunityId,
      userId,
      choice,
    });
    setIsVoting(false);
    // Play click sound on vote submission
    if (audioBuffer) playSound(audioBuffer, "/Sounds/click_sound.wav");
  };

  const handleBreakTie = () => {
    console.log("🔥 Attempting tie-breaker");
    socket.emit("tie:attempt", { tid: tournamentId });
    setShowTieBreaker(false);
    setIsEliminated(false);
  };

  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    (async () => {
      try {
        const clickRes = await fetch("/Sounds/click_sound.wav");
        const clickBuf = await clickRes.arrayBuffer();
        setAudioBuffer(await ctx.decodeAudioData(clickBuf));
        const celebrateRes = await fetch("/Sounds/celebration.wav");
        const celebrateBuf = await celebrateRes.arrayBuffer();
        setCelebrationBuffer(await ctx.decodeAudioData(celebrateBuf));
        const sirenRes = await fetch("/Sounds/celebration.wav");
        const sirenBuf = await sirenRes.arrayBuffer();
        setSirenBuffer(await ctx.decodeAudioData(sirenBuf));
      } catch (e) {
        console.error("Error loading sounds:", e);
      }
    })();
  }, []);

  // Confetti Effect for Winners
  useEffect(() => {
    if (gameOver && isWinner) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF4500", "#1E90FF"],
      });
    }
  }, [gameOver, isWinner]);

  return (
    <div className="game-console">
      <Header />
      {isEliminated && !gameOver ? (
        <div className="eliminated-screen">
          <h2>🚫 You’ve been eliminated</h2>
          {showTieBreaker ? (
            <button className="game_stroke_links" onClick={handleBreakTie}>
              Break the Tie 🔥
            </button>
          ) : (
            <p>Waiting to see if tie-breaker opens...</p>
          )}
        </div>
      ) : gameOver ? (
        <div className="game-over">
          {isWinner ? (
            <div className="game-over-winner">
              <h1>
                <span role="img" aria-label="party">🎉</span> You’re the Champion! <span role="img" aria-label="trophy">🏆</span>
              </h1>
              <p>Congratulations, {user?.username || "Player"}! You conquered the tournament!</p>
              <div className="game-over-buttons">
                <button
                  onClick={() => router.push("/Home")}
                  className="game-over-button return-home"
                >
                  Return Home
                </button>
                <button
                  onClick={() => {
                    setGameOver(false);
                    setIsWinner(false);
                    router.push("/Home");
                  }}
                  className="game-over-button play-again"
                >
                  Play Again
                </button>
              </div>
            </div>
          ) : (
            <div className="game-over-loser">
              <h1>😔 Game Over</h1>
              <p>The tournament has ended. Better luck next time!</p>
              <p>
                Winner: <span className="winner-name">{winner || "Unknown"}</span>
              </p>
              <div className="game-over-buttons">
                <button
                  onClick={() => router.push("/Home")}
                  className="game-over-button return-home"
                >
                  Return Home
                </button>
                <button
                  onClick={() => {
                    setGameOver(false);
                    router.push("/Home");
                  }}
                  className="game-over-button play-again"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="current_game_info_buttons">
            <div className="game_info_circle"><h4>Players</h4><p>{noOfPlayers}</p></div>
            <div className="game_info_large"><h4>Round</h4><p>{currentRound}</p></div>
            <div className="game_info_circle"><h4>Points</h4><p>{scores}</p></div>
          </div>
          <div className="game-slide">
            <div className="game_opportunity_info">
              <h4>Opportunity: {opportunityNumber}</h4>
            </div>
            {showVoteResultOverlay && <Results results={showVoteResultOverlay} />}
            <div className="game_round_container">
              {[1, 2, 3].map((opp) => {
                const roundResult = results[opp];
                return (
                  <Round
                    key={opp}
                    round={opp}
                    yesScore={roundResult ? roundResult.yesVotes : 0}
                    noScore={roundResult ? roundResult.noVotes : 0}
                    isPlayed={!!roundResult && roundResult.minority !== null}
                    isActive={opportunityNumber === opp && isVoting}
                    currentRound={currentRound}
                    minority={roundResult ? roundResult.minority : null}
                    roundId={opp}
                  />
                );
              })}
            </div>
            <PrizeChangeModal prizeStats={prizeWindow.stats || []} endsAt={prizeWindow.endsAt} />
            <div className="gamebuttonsContainer">
              <div className="game_buttons_container">
                <button
                  className="game_y_button"
                  onClick={() => {
                    handleSelectOption("yes");
                  }}
                  disabled={!isVoting || roundTimer <= 0 || gameOver}
                >
                  Yes
                </button>
                <button
                  className="game_n_button"
                  onClick={() => {
                    handleSelectOption("no");
                  }}
                  disabled={!isVoting || roundTimer <= 0 || gameOver}
                >
                  No
                </button>
                <div
                  className={`game_circle ${!isVoting || hasVoted || !option || roundTimer <= 0 || gameOver ? "disabled" : ""}`}
                  onClick={() => handleVote(option)}
                >
                  {roundTimer > 0 ? (
                    <p className="timer_text">
                      <span>{roundTimer}s</span>
                      {option && <span>submit</span>}
                    </p>
                  ) : (
                    <span className="timer_text">Loading...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameConsole;