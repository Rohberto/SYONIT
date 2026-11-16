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
  const [sharedWin, setSharedWin] = useState(false);
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
      setShowVoteResultOverlay(null); // never leave the previous result covering a new vote
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
      if (lastVote) {
        if (lastVote === minority) {
          if (celebrationBuffer) playSound(celebrationBuffer, "/Sounds/celebration.wav");
        } else {
          toast.warn("Oops, you are not in the minority!");
        }
      }
    };

    const handleRoundReplay = ({ message }) => {
      toast.info(message || "Nobody was in the minority. Replaying the round!", { toastId: "round-replay" });
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

    const handleTournamentEnded = ({ tid, winnerId, winnerName, winnerIds, shared }) => {
      console.log(`🏆 Tournament ${tid} ended. Winner: ${winnerName} (ID: ${winnerId})`);
      setGameOver(true);
      setWinner(winnerName || "No Winner");
      setSharedWin(!!shared);
      setIsWinner(!!userId && (userId === winnerId || (Array.isArray(winnerIds) && winnerIds.includes(userId))));
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
    socket.on("round:replay", handleRoundReplay);
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
      socket.off("round:replay", handleRoundReplay);
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
          <div className="status-card">
            <div className="status-emoji" aria-hidden="true">🚫</div>
            <h2>You’ve been eliminated</h2>
            {showTieBreaker ? (
              <>
                <p>A tie-breaker is open. Win it to get back in.</p>
                <button className="status-btn" onClick={handleBreakTie}>
                  Break the Tie 🔥
                </button>
              </>
            ) : (
              <p>Waiting to see if a tie-breaker opens...</p>
            )}
            <button className="status-btn status-btn--ghost" onClick={() => router.push("/Home")}>
              Back to Home
            </button>
          </div>
        </div>
      ) : gameOver ? (
        <div className="game-over">
          {isWinner ? (
            <div className="game-over-winner status-card status-card--win">
              <h1>
                <span role="img" aria-label="party">🎉</span> {sharedWin ? "You share the win!" : "You’re the Champion!"} <span role="img" aria-label="trophy">🏆</span>
              </h1>
              <p>Congratulations, {user?.username || "Player"}! {sharedWin ? "Nobody could be beaten, so the survivors share the win." : "You conquered the tournament!"}</p>
              <div className="game-over-buttons">
                <button onClick={() => router.push("/Home")} className="game-over-button play-again">
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="game-over-loser status-card status-card--lose">
              <h1>😔 Game Over</h1>
              <p>The tournament has ended. Better luck next time!</p>
              <p>
                Winner: <span className="winner-name">{winner || "Unknown"}</span>
              </p>
              <div className="game-over-buttons">
                <button onClick={() => router.push("/Home")} className="game-over-button play-again">
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="game-stats" aria-label="Game status">
            <div className="game-stat"><span className="game-stat__label">Players</span><span className="game-stat__value">{noOfPlayers}</span></div>
            <div className="game-stat game-stat--main"><span className="game-stat__label">Round</span><span className="game-stat__value">{currentRound}</span></div>
            <div className="game-stat"><span className="game-stat__label">Points</span><span className="game-stat__value">{scores}</span></div>
          </div>
          <div className="game-slide">
            <div className="game_opportunity_info">
              <h4>{opportunityNumber ? `Opportunity ${opportunityNumber} of 3` : "Get ready"}</h4>
              <p className="game_hint" role="status" aria-live="polite">
                {isEliminated
                  ? ""
                  : hasVoted
                  ? "Vote locked in. Waiting for results..."
                  : isVoting
                  ? option
                    ? "Now tap the centre circle to lock it in"
                    : "Pick YES or NO. Be in the minority to score!"
                  : opportunityNumber
                  ? "Waiting for the next opportunity..."
                  : "The game is about to begin"}
              </p>
            </div>
            {showVoteResultOverlay && <Results results={showVoteResultOverlay} myVote={lastVote} onClose={() => setShowVoteResultOverlay(null)} />}
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
                  className={`game_y_button ${option === "yes" ? "is-selected" : ""}`}
                  aria-pressed={option === "yes"}
                  onClick={() => {
                    handleSelectOption("yes");
                  }}
                  disabled={!isVoting || roundTimer <= 0 || gameOver}
                >
                  Yes
                </button>
                <button
                  className={`game_n_button ${option === "no" ? "is-selected" : ""}`}
                  aria-pressed={option === "no"}
                  onClick={() => {
                    handleSelectOption("no");
                  }}
                  disabled={!isVoting || roundTimer <= 0 || gameOver}
                >
                  No
                </button>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={option ? `Lock in ${option}` : "Timer"}
                  className={`game_circle ${!isVoting || hasVoted || !option || roundTimer <= 0 || gameOver ? "disabled" : "ready"} ${isVoting && roundTimer > 0 && roundTimer <= 5 ? "urgent" : ""}`}
                  onClick={() => handleVote(option)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleVote(option);
                    }
                  }}
                >
                  {roundTimer > 0 ? (
                    <p className="timer_text">
                      <span className="timer_num">{roundTimer}</span>
                      <span className="timer_sub">{hasVoted ? "locked" : option ? "lock in" : "sec"}</span>
                    </p>
                  ) : (
                    <span className="timer_text">{hasVoted ? "Locked" : "Wait"}</span>
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