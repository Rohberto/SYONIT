import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './button.css';
import { getAudioContext, playSound } from '../../libs/audioContext';
import axios from 'axios';
import { useSocket } from '../../Context/SocketContext';

const Button = ({ formatTime, timeLeft, tournament, user , joined, setJoined}) => {
  const [lines, setLines] = useState([]);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const router = useRouter();
  const { socket } = useSocket();

  // load click sound
  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    (async () => {
      try {
        const res = await fetch('/Sounds/click_sound.wav');
        if (!res.ok) throw new Error('Failed to fetch click sound');
        const buf = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(buf);
        setAudioBuffer(decoded);
      } catch (e) {
        console.error('Error loading click sound:', e);
      }
    })();
  }, []);

  // stroke lines effect
  useEffect(() => {
    setLines(Array.from({ length: 60 }, (_, i) => ({ id: i, active: true })));
  }, []);



  // disable when: no tournament, not waiting, no time left, already joined, or no user
  const disableReadyUp =
    !tournament ||
    tournament.status !== 'waiting' ||
    timeLeft <= 0 ||
    joined ||
    !user?.id;

  const handleReadyUp = async () => {
    if (disableReadyUp) return;
    if (audioBuffer) playSound(audioBuffer, '/Sounds/click_sound.wav');

    const tid = tournament?.tid ;
    if (!tid) {
      console.warn('No tournament id (tid) found');
      return;
    }
    if (!user?.id) {
      console.warn('No user id found');
      return;
    }

    try {
      // 1) register on backend (DB)
      const res = await axios.post('http://localhost:4000/api/tournament/join', {
        userId: user.id,
        tid: tournament.tid, // if your controller ignores this, it's fine
      });

      if (res.data?.ok) {
        setJoined(true);
        console.log('✅ Joined tournament in DB');

        if (socket) {
          // 2) ask server to validate & add this socket to the tournament room
          socket.emit('tournament:join', { tid, userId: user.id });

          // 3) fallback for current backend: use generic subscribe (no validation)
          socket.emit('subscribe', `tournament-${tid}`);
        }
      } else {
        console.warn('Join response not ok:', res.data);
      }
    } catch (err) {
      console.error('Join error:', err?.response?.data || err.message);
      setJoined(false);
    }
  };

  return (
    <div className="buttonsContainer">
      {/* Invite button */}
      <button
        className="game_stroke_links"
        onClick={() => {
          if (audioBuffer) playSound(audioBuffer, '/Sounds/click_sound.wav');
          router.push('/Invite');
        }}
      >
        INVITE
      </button>

      {/* Ready up button */}
      <button
        className="game_stroke_links"
        disabled={disableReadyUp}
        onClick={handleReadyUp}
      >
        {joined ? 'JOINED ✔' : 'READY UP'}
      </button>

      {/* Countdown circle */}
      <div className="home_circle">
        <div className="circle_info">
          <p>NEXT</p>
          <h1>
            {tournament && tournament.status === 'waiting'
              ? formatTime(timeLeft)
              : '--:--'}
          </h1>
          <p>GAME</p>
        </div>
      </div>
    </div>
  );
};

export default Button;
