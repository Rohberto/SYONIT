"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
const [tournament, setTournament] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [noOfPlayers, setNoOfPlayers] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0); // 12:30 in seconds (12*60 + 30)


  useEffect(() => {
      const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:4000", {
      autoConnect: true,
        auth: { token },
    });

    setSocket(newSocket);

    // listen for connection
    newSocket.on("connect", () => {
      console.log("✅ Connected to socket server:", newSocket.id);
      setConnected(true);
    });

    //get current tournaments
      newSocket.on("tournament:list", (data) => {
      console.log("available tournament", data);
      setTournament(data);
    });

    // listen for disconnection
    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
      setConnected(false);
    });

    // cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

   useEffect(() => {
      if (!socket) return;
    console.log("yeahh");
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

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SocketContext.Provider value={{ socket, connected, tournament, setTournament, noOfPlayers, setNoOfPlayers, timeLeft, setTimeLeft, formatTime}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
