"use client";
import React, { useEffect, useState } from "react";
import Header from "../Components/MainHeader";
import Button from "../Components/syonit_button/mainButton";
import { useUser } from "../Context/userContext";
import { useSocket } from "../Context/SocketContext";
import {useRouter} from "next/navigation";
import "./prize.css";

const PrizePage = () => {
  const { socket, tournament, timeLeft, handleReadyUp, setSelectedPrize } = useSocket();
  const { user } = useUser();

  const [prizes, setPrizes] = useState([]);
 
  const [showModal, setShowModal] = useState(false);
  const [pendingPrize, setPendingPrize] = useState(null);
  const router = useRouter();
  // ✅ Fetch prizes on load
  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/prizes"); // GET all prizes
        if (!res.ok) throw new Error("Failed to fetch prizes");
        const data = await res.json();
        setPrizes(data);
      } catch (err) {
        console.error("Error fetching prizes:", err.message);
      }
    };

    fetchPrizes();
  }, []);

  // ✅ Handle selecting prize (after confirmation)
  const handleSelectPrize = async (prizeId) => {
    setSelectedPrize(prizeId);

    try {
      const res = await fetch("http://localhost:4000/api/prizes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantId: user?.participantId, // you must pass this from context
          prizeId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign prize");

      alert("Prize selected successfully!");
    } catch (err) {
      console.error("Error selecting prize:", err.message);
      alert(err.message);
    }
  };

  // ✅ Show confirmation modal
  const confirmPrizeSelection = (prizeId, prizeName) => {
    setPendingPrize(prizeId);
    setSelectedPrize(prizeName);
    setShowModal(true);
  };

  // ✅ Handle modal confirm
  const handleConfirm = () => {
    if (pendingPrize) {
   handleReadyUp(user, pendingPrize);
  
    }
    setShowModal(false);
    setPendingPrize(null);
    router.push('/Home'); // redirect to home after selection
  };

  // ✅ Handle modal cancel
  const handleCancel = () => {
    setShowModal(false);
    setPendingPrize(null);
    setSelectedPrize(null);
  };

  return (
    <div className="gameContainer">
        <Header />

        <h3>Prizes Available</h3>
        <div className="Home-slide">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className={`prize-item ${pendingPrize === prize.id ? "selected" : ""}`}
              onClick={() => confirmPrizeSelection(prize.id, prize.name)}
            >
              <img src={prize.imageUrl} alt={prize.name} className="prize-image" />
              <div className="prize-info">
                <h4>{prize.name}</h4>
                {/*<p>{prize.description}</p>*/}
                <p>Points Required: {prize.pointsRequired}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-button">
          <div className="game_details">
            <p>ONLINE: 3</p>
            <p>IN GAME: 1</p>
          </div>

          <div className="prize-button buttonsContainer glassBtn">
            {`Next Tournament Starts In : ${timeLeft}`}
          </div>
        </div>
      

      {/* ✅ Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Selection</h3>
            <p>Are you sure you want to select this prize?</p>
            <div className="modal-actions">
              <button onClick={handleConfirm} className="confirm-btn">Yes</button>
              <button onClick={handleCancel} className="cancel-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrizePage;
