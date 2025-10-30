"use client";

import { useRef, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/app/Context/SocketContext";
import { useUser } from "@/app/Context/userContext";
import Header from "@/app/Components/MainHeader";
import Round from "@/app/Components/Round";
import { getAudioContext, playSound } from "@/app/libs/audioContext";
import PrizeChangeModal from "@/app/Components/PrizeChangeModal";
import "./game.css";

const GameConsole = () => {
  const router = useRouter();
  const { socket, noOfPlayers, prizeWindow,  } = useSocket();
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

  // 👇 new states for elimination/tiebreaker
  const [isEliminated, setIsEliminated] = useState(false);
  const [showTieBreaker, setShowTieBreaker] = useState(false);

  const opportunityRef = useRef(opportunityNumber);

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
    if (!socket || !socket.connected) return;

    console.log("Joining tournament:", tournamentId, userId);
   // socket.emit("tournament:join", { tid: tournamentId, userId });

    const handleTournamentStarting = ({ startsIn, playersCount }) => {
      setRoundTimer(startsIn);
      setIsVoting(false);
    };

    const handleRoundStarted = ({ roundNumber }) => {
      setCurrentRound(roundNumber);
      setResults({ 1: null, 2: null, 3: null });
      setOpportunityNumber(0);
    };

    const handleOpportunityStarted = ({ oid, opportunityNumber, endsAt }) => {
      setOpportunityId(oid);
      setOpportunityNumber(opportunityNumber);
      if (sirenBuffer) playSound(sirenBuffer, "/Sounds/siren.wav");
      setIsVoting(true);

      setLastVote(null);

      setResults((prev) => ({
        ...prev,
        [opportunityNumber]: null,
      }));

      const msLeft = new Date(endsAt).getTime() - Date.now();
      setRoundTimer(Math.floor(msLeft / 1000));
    };

    const handleOpportunityEnded = ({ opportunityId, yesVotes, noVotes, minority }) => {
      setIsVoting(false);

      setResults((prev) => ({
        ...prev,
        [opportunityRef.current]: { 
          yesVotes: yesVotes ?? 0, 
          noVotes: noVotes ?? 0, 
          minority: minority ?? "none"
        },
      }));

      if (lastVote) {
        if (lastVote === minority) {
          if (celebrationBuffer) playSound(celebrationBuffer, "/Sounds/celebration.wav");
        } else {
          alert("Oops, you are not in the minority!");
        }
      }
    };

    const handleRoundEnded = () => {
      setIsVoting(false);
    };

    const handleTournamentEnded = ({ winnerId, winnerName }) => {
      setGameOver(true);
  setWinner(winnerName);

  if (userId && userId === winnerId) {
    setIsWinner(true);
  } else {
    setIsWinner(false);
  }
    };
/*
    // ✅ scores
    socket.on("score:updated", ({ score }) => {
      setScores(score);
    });

    // ✅ eliminated
    socket.on("player:eliminated", ({ message }) => {
      alert(message);
      setIsEliminated(true); // 🚫 don't redirect yet
    });

    // ✅ tie breaker
    socket.on("tie:breaker", () => {
      console.log("Tie breaker available");
      if (isEliminated) {
        setShowTieBreaker(true);
      }
    });
    socket.on("tie:resolved", ({ tid, winnerId }) => {
  // If this client is the revived player, clear eliminated state
  if (userId && winnerId === userId) {
    setIsEliminated(false);
    setShowTieBreaker(false);
  } else {
    // if not the revived player, they were in eliminated room and should see tie closed
    setShowTieBreaker(false);
  }
  // Optional: show toast
  // toast.info(winnerId ? `Player ${winnerId} won the tie` : "Tie resolved");
});


    socket.on("tournament:starting", handleTournamentStarting);
    socket.on("round:started", handleRoundStarted);
    socket.on("opportunity:started", handleOpportunityStarted);
    socket.on("opportunity:ended", handleOpportunityEnded);
    socket.on("round:ended", handleRoundEnded);
    socket.on("tournament:ended", handleTournamentEnded);
*/
    return () => {
      socket.off("tournament:starting", handleTournamentStarting);
      socket.off("round:started", handleRoundStarted);
      socket.off("opportunity:started", handleOpportunityStarted);
      socket.off("opportunity:ended", handleOpportunityEnded);
      socket.off("round:ended", handleRoundEnded);
      socket.off("tournament:ended", handleTournamentEnded);
      socket.off("score:updated");
      socket.off("player:eliminated");
      socket.off("tie:breaker");
    };
  }, [socket, tournamentId, userId, lastVote, celebrationBuffer, isEliminated]);

  // countdown
  useEffect(() => {
    if (roundTimer <= 0) return;
    const interval = setInterval(() => {
      setRoundTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [roundTimer]);

  const handleVote = (choice) => {
    if (!opportunityId) return;

    setLastVote(choice);
    socket.emit("vote", {
      tid: tournamentId,
      opportunityId,
      userId,
      choice,
    });
    setIsVoting(false);
  };

  // 👇 new tie-breaker click handler
  const handleBreakTie = () => {
    socket.emit("tie:attempt", { tid: tournamentId});
    setShowTieBreaker(false);
    setIsEliminated(false); // they’re back in!
  };

  // load sounds
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

  return (
    <div className="game-console">
      <Header />

      {/*isEliminated && !gameOver ? (
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
      <h2>🎉 Congratulations! You’ve won the tournament 🏆</h2>
    ) : (
      <>
        <h2>😔 Game Over — You lost</h2>
        <p>Winner: {winner}</p>
      </>
    )}

    {

    }

    <button onClick={() => router.push("/Home")}>Go Home</button>
  </div>
      ) :*
       (*/}
        <div className="game-slide">
          <div className="current_game_info_buttons">
            <div className="game_info"><h4>Players</h4><p>{noOfPlayers}</p></div>
            <div className="game_info"><h4>Opportunity</h4><p>{opportunityNumber}</p></div>
            <div className="game_info"><h4>Round</h4><p>{currentRound}</p></div>
            <div className="game_info"><h4>Points</h4><p>{scores}</p></div>
            <div className="divider"></div>
          </div>

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
              />
            );
          })}
          </div>

           <PrizeChangeModal
        prizeStats={prizeWindow.stats || []}
        endsAt={prizeWindow.endsAt}
      />

          <div className="gamebuttonsContainer">
            <div className="buttonsContainer">
              <button
                className="game_stroke_links y_button"
                onClick={() => {
                  handleVote("yes");
                  if (audioBuffer) playSound(audioBuffer, "/Sounds/click_sound.wav");
                }}
                disabled={!isVoting || roundTimer <= 0 || gameOver}
              >
                Yes
              </button>

              <button
                className="game_stroke_links n_button"
                onClick={() => {
                  handleVote("no");
                  if (audioBuffer) playSound(audioBuffer, "/Sounds/click_sound.wav");
                }}
                disabled={!isVoting || roundTimer <= 0 || gameOver}
              >
                No
              </button>

              <div className="home_circle">
                {roundTimer > 0 ? (
                  <span className="timer_text">{roundTimer}s</span>
                ) : (
                  <span className="timer_text">Loading...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      {/*)}*/}
    </div>
  );
};

export default GameConsole;
