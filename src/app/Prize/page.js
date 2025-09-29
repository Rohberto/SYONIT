"use client";
import React, { useEffect, useState } from "react";
import Header from "../Components/MainHeader";
import Button from "../Components/syonit_button/mainButton";
import { useUser } from "../Context/userContext";
import { useSocket } from "../Context/SocketContext";
import "./prize.css";

const PrizePage = () => {
  const { socket, tournament, timeLeft, formatTime } = useSocket();
  const { user } = useUser();
  const [prizes, setPrizes] = useState([]);
  const [selectedPrize, setSelectedPrize] = useState(null);

  // Fetch prizes from backend
  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prizes"); // adjust base URL if needed
        const data = await res.json();
        setPrizes(data);
      } catch (err) {
        console.error("Failed to load prizes", err);
      }
    };

    fetchPrizes();
  }, []);

  // Handle prize selection
  const handleSelectPrize = (prizeId) => {
    setSelectedPrize(prizeId);

    // ✅ Send selection to server via socket (joining tournament with prize)
    if (tournament) {
      socket.emit("tournament:join", {
        tid: tournament.id,
        prizeId,
      });
    }
  };

  return (
    <div className="gameContainer">
      <div className="glassy-panel">
        <Header />

        <>
          <h3>Prizes Available</h3>
          <div className="Home-slide">
            {prizes.map((prize) => (
              <div
                key={prize.id}
                className={`prize-item ${
                  selectedPrize === prize.id ? "selected" : ""
                }`}
                onClick={() => handleSelectPrize(prize.id)}
              >
                <img src={prize.imageUrl} alt={prize.name} />
                <div>
                  <h4>{prize.name}</h4>
                  <p>{prize.requiredPoints} pts</p>
                </div>
              </div>
            ))}
          </div>
        </>

        <div className="bottom-button">
          <div className="game_details">
            <p>ONLINE: 3</p>
            <p>1: IN GAME</p>
          </div>

          <Button
            formatTime={formatTime}
            timeLeft={timeLeft}
            tournament={tournament}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

export default PrizePage;
