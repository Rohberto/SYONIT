import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./button.css";
import { getAudioContext, playSound } from "../../libs/audioContext";
import Glass from "../GlassyButton/Glass";
import { useSocket } from "../../Context/SocketContext";

const Button = ({ formatTime, timeLeft, tournament, user }) => {
  const [lines, setLines] = useState([]);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const router = useRouter();

  // ✅ Get everything from context directly
  const { socket, joined, setJoined } = useSocket();

  // load click sound
  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    (async () => {
      try {
        const res = await fetch("/Sounds/click_sound.wav");
        if (!res.ok) throw new Error("Failed to fetch click sound");
        const buf = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(buf);
        setAudioBuffer(decoded);
      } catch (e) {
        console.error("Error loading click sound:", e);
      }
    })();
  }, []);

  // stroke lines effect
  useEffect(() => {
    setLines(Array.from({ length: 60 }, (_, i) => ({ id: i, active: true })));
  }, []);

  const disableReadyUp =
    !tournament ||
    tournament.status !== "waiting" ||
    timeLeft <= 0 ||
    joined ||
    !user?.id;

  return (
    <div className="buttonsContainer glassContainer">
      {/* Invite button */}
      <button
        className="game_stroke_links"
        onClick={() => {
          if (audioBuffer) playSound(audioBuffer, "/Sounds/click_sound.wav");
          router.push("/Invite");
        }}
      >
        INVITE
      </button>

      {/* Ready up button */}
      <button
        className="game_stroke_links"
        disabled={disableReadyUp}
        onClick={() => {
          if (disableReadyUp) return;
          if (audioBuffer) playSound(audioBuffer, "/Sounds/click_sound.wav");
          router.push("/Prize");
        }}
      >
        {joined ? "JOINED ✔" : "READY UP"}
      </button>

      {/* Countdown circle */}
      <div className="home_circle homeglassBtn">
        <div className="circle_info">
          <p>NEXT</p>
          <h1>
            {tournament && tournament.status === "waiting"
              ? formatTime(timeLeft)
              : "--:--"}
          </h1>
          <p>GAME</p>
        </div>
      </div>
      <Glass />
    </div>
  );
};

export default Button;
