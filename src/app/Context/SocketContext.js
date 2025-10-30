"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SocketContext = createContext(null);
let socketInstance = null; // ✅ Prevents duplicate sockets

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [tournament, setTournament] = useState(null);
  const [noOfPlayers, setNoOfPlayers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [prizeId, setPrizeId] = useState(null);
  const [joined, setJoined] = useState(false);
  const [gameTimer, setGameTimer] = useState(0);
  const [prizeWindow, setPrizeWindow] = useState({
    open: false,
    endsAt: null,
    stats: null,
  });
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);

  const router = useRouter();

  // ✅ Initialize socket (after client mounts + token available)
  useEffect(() => {
    const initSocket = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found — socket not initialized yet.");
        return;
      }

      if (socketInstance) {
        console.log("♻️ Using existing socket instance");
        setSocket(socketInstance);
        return;
      }

      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
        autoConnect: true,
        transports: ["websocket"], // ✅ Stable connection
        auth: { token },
      });

      socketInstance = newSocket;
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Connected to socket server:", newSocket.id);
        setConnected(true);

        const token = localStorage.getItem("token");
  if (token) {
    newSocket.emit("user:register", { token });
  }
      });

       newSocket.on("online:count", (data) => {
    console.log("👥 Players online:", data.count);
    setOnlineCount(data.count);
  });

 

      newSocket.on("reconnect", () => {
  console.log("🔁 Reconnected to socket server");
  const token = localStorage.getItem("token");
  if (token) newSocket.emit("user:register", { token });
});


      newSocket.on("disconnect", () => {
        console.log("❌ Disconnected from socket server");
        setConnected(false);
      });

      newSocket.on("connect_error", (err) => {
        console.error("⚠️ Socket connection error:", err.message);
      });

      // initial tournaments
      newSocket.on("tournament:list", (data) => {
        console.log("📋 available tournaments:", data);
        setTournament(data);
      });
    };

    // Delay slightly to allow hydration + localStorage
    setTimeout(initSocket, 200);

    return () => {
      if (socketInstance) {
        console.log("🔌 Cleaning up socket connection");
        socketInstance.disconnect();
        socketInstance = null;
      }
       socket.off("online:count");
    };
  }, []);

  // 🎮 Register socket listeners when socket is ready
  useEffect(() => {
    if (!socket) return;

    // --- TOURNAMENT CREATED ---
    socket.on("tournament:created", (data) => {
      console.log("🎯 Tournament created", data);
      setTournament((prev) => ({ ...prev, ...data }));
    });

    // --- NEW PLAYER JOINED ---
    socket.on("tournament:newPlayer", (data) => {
      console.log("👥 New player joined", data);
    });

    // --- VOTE ERROR ---
    socket.on("vote:error", (err) => {
      console.error("Vote error:", err.message);
    });

    // --- JOIN SUCCESS ---
    const onJoined = ({ tid, room }) => {
      setJoined(true);
      console.log(`✅ Joined room ${room} for tournament ${tid}`);
    };

    // --- JOIN ERROR ---
    const onError = (payload) => {
      console.warn("❌ tournament:error", payload?.message || payload);
      setJoined(false);
    };

    // --- TOURNAMENT CANCELLED ---
    const onCancelled = ({ tid }) => {
      setTournament((prev) => {
        if (prev?.tid === tid || prev?.id === tid) {
          console.log("⚠️ Tournament cancelled");
          setJoined(false);
          return { ...prev, status: "cancelled" };
        }
        return prev;
      });
    };

    // --- TOURNAMENT STARTING ---
    socket.on("tournament-starting", (data) => {
      console.log("🚀 Tournament starting:", data);
      toast.info(`Tournament starting in ${data.startsIn / 1000}s...`);
      setNoOfPlayers(data.playersCount);
      setGameTimer(data.startsIn);
      router.push(`/game/${data.tid}`);
    });

    /*
    // 🎁 PRIZE CHANGE WINDOW OPENED ---
    socket.on("prize:change:window:opened", (data) => {
      console.log("🎁 Prize change window opened:", data);
      toast.info("🎁 Prize change window is now open! Hurry up!");
      setPrizeWindow({
        open: true,
        endsAt: data.endsAt,
        stats: data.stats,
      });
    });

    // 🎁 PRIZE CHANGE WINDOW CLOSED ---
    socket.on("prize:change:window:closed", (data) => {
      console.log("⏰ Prize change window closed:", data);
      toast.warn("⏰ Prize change window closed!");
      setPrizeWindow({
        open: false,
        endsAt: null,
        stats: null,
      });
    });
*/
    // --- Attach handlers ---
    socket.on("tournament:joined", onJoined);
    socket.on("tournament:error", onError);
    socket.on("tournament:cancelled", onCancelled);

    // --- Cleanup ---
    return () => {
      socket.off("tournament:created");
      socket.off("tournament:newPlayer");
      socket.off("vote:error");
      socket.off("tournament:joined", onJoined);
      socket.off("tournament:error", onError);
      socket.off("tournament:cancelled", onCancelled);
      socket.off("tournament-starting");
      socket.off("prize:change:window:opened");
      socket.off("prize:change:window:closed");
    };
  }, [socket]);

  // 🕓 Compute remaining lobby time
  useEffect(() => {
    if (!tournament || !tournament.lobbyEndsAt) return;

    const endTime = new Date(tournament.lobbyEndsAt).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((endTime - now) / 1000));
    console.log("⏱️ Time left:", diff);
    setTimeLeft(diff);
  }, [tournament]);

  // ⏳ Countdown timer
  useEffect(() => {
    if (!tournament || tournament.status !== "waiting" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [tournament?.status, timeLeft]);

  // 🧮 Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // 🟢 READY UP HANDLER
  const disableReadyUp =
    !tournament || tournament.status !== "waiting" || timeLeft <= 0 || joined;

  const handleReadyUp = async (user, prizeId) => {
    if (disableReadyUp) return;

    const tid = tournament?.tid;
    if (!tid) return console.warn("⚠️ No tournament ID found");
    if (!user?.id) return console.warn("⚠️ No user ID found");

    try {
      const res = await axios.post("http://localhost:4000/api/tournament/join", {
        userId: user.id,
        tid: tournament.tid,
      });

      if (res.data?.ok) {
        setJoined(true);
        console.log("✅ Joined tournament in DB");
        setPrizeId(prizeId);

        socket.emit("tournament:join", { tid, userId: user.id, prizeId });
        socket.emit("subscribe", `tournament-${tid}`);
      } else {
        console.warn("Join response not ok:", res.data);
        setSelectedPrize(null);
      }
    } catch (err) {
      console.error("Join error:", err?.response?.data || err.message);
      setJoined(false);
      setSelectedPrize(null);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        tournament,
        setTournament,
        noOfPlayers,
        setNoOfPlayers,
        timeLeft,
        setTimeLeft,
        formatTime,
        handleReadyUp,
        prizeId,
        setPrizeId,
        prizeWindow,
        selectedPrize,
        setSelectedPrize,
        joined,
        setJoined,
        gameTimer,
        setGameTimer,
        onlineCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
