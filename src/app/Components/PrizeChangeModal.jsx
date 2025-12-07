"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Button from "./Prize/Button";
import "./PrizeChangeModal.css";
import { useSocket } from "../Context/SocketContext";
import { useUser } from "../Context/userContext";

const COLORS = ["#ffcc00", "#00c49f", "#ff7f50", "#8884d8", "#82ca9d", "#ff6666"];

const PrizeChangeModal = ({  prizeStats, endsAt }) => {
  const [timeLeft, setTimeLeft] = useState(0);
    const { socket, tournament, setSelectedPrize, setPrizeId, selectedPrize, setPrizeWindow, prizeWindow } = useSocket();
    const [loading, setLoading] = useState(false);
  const { user } = useUser();
let isOpen = prizeWindow.open

  // Countdown timer
  useEffect(() => {
    if (!endsAt) return;
    const interval = setInterval(() => {
      const diff = new Date(endsAt) - new Date();
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!isOpen) return null;

    const handlePrizeChange = (prizeId) => {
    if (!socket || !tournament) return;
    if (!user) return alert("You must be logged in!");

    setLoading(true);

    socket.emit("prize:change", { tid: tournament.tid, newPrizeId: prizeId });

    socket.once("prize:changed", (data) => {
      setLoading(false);
      alert(data.message || "Prize changed successfully!");
      setSelectedPrize(data.prizeName);
      setPrizeId(data.prizeId);
    });

    socket.once("prize:error", (err) => {
      setLoading(false);
      alert(err.message || "An error occurred while changing the prize.");
    });
  };

  const onClose = () => {
    setPrizeWindow(prev => ({...prev, open: false}))
  }

  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.9, y: -40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="modal-title">🎁 Prize Change Window</h2>
        <h4 className="modalPrize">Current Prize: {selectedPrize}</h4>
        <p className="modal-timer">Time left: {timeLeft}s</p>

        {/* Pie Chart */}
        <div className="chart-container">
          <PieChart width={300} height={300}>
            <Pie
              data={prizeStats}
              dataKey="choosers"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {prizeStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Prize List */}
        <div className="prize-list">
          {prizeStats.map((prize, index) => (
            <div key={index} className="prize-item">
              <div className="prize-info">
                <strong>{prize.name}</strong>
                <p>{prize.choosers} players chose this</p>
                <small>Quantity Left: {prize.quantityLeft}</small>
              </div>
              <Button
                variant="outline"
                className="change-btn"
                onClick={() => handlePrizeChange(prize.id)}
              >
                Select
              </Button>
            </div>
          ))}
        </div>

        <Button className="close-btn" onClick={onClose}>
          Close
        </Button>
      </motion.div>
    </div>
  );
};

export default PrizeChangeModal;
