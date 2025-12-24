"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "./userContext";

const SocketContext = createContext(null);
let socketInstance = null;

export const SocketProvider = ({ children }) => {
  const { user, setUserPrize } = useUser();
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
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  // Initialize socket
  useEffect(() => {
    const initSocket = async () => {
   const token = localStorage.getItem("token");
    if (!user || !token) {
      console.warn("⚠️ No user/token found — socket not initialized yet.");
      return;
    }

    // Always disconnect previous socket if any
    if (socketInstance) {
      console.log("🔌 Cleaning up previous socket instance");
      socketInstance.disconnect();
      socketInstance = null;
    }

    console.log("🔌 Initializing socket connection...");
    const newSocket = io(
      url,
      {
        autoConnect: true,
        transports: ["websocket"],
        auth: { token },
      }
    );

    socketInstance = newSocket;
    setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("✅ Connected to socket server:", newSocket.id);
        setConnected(true);
        const token = localStorage.getItem("token");
        if (token) {
          newSocket.emit("user:register", { token });
        }
        if (tournament?.tid && user?.id) {
          console.log(`🔄 Checking participation for tournament ${tournament.tid}`);
          newSocket.emit("checkParticipation", { tid: tournament.tid, userId: user.id });
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
        if (tournament?.tid && user?.id) {
          console.log(`🔄 Re-checking participation for tournament ${tournament.tid}`);
          newSocket.emit("checkParticipation", { tid: tournament.tid, userId: user.id });
        }
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Disconnected from socket server");
        setConnected(false);
        setJoined(false);
      });

      newSocket.on("connect_error", (err) => {
        console.error("⚠️ Socket connection error:", err.message);
      });

      newSocket.on("tournament:list", (data) => {
        console.log("📋 Available tournaments:", data);
        setTournament(data);
        if (data?.tid && user?.id) {
          console.log(`🔄 Checking participation for new tournament ${data.tid}`);
          newSocket.emit("checkParticipation", { tid: data.tid, userId: user.id });
        }
      });

      return () => {
        if (socketInstance) {
          console.log("🔌 Cleaning up socket connection");
          socketInstance.disconnect();
          socketInstance = null;
        }
        if (socket) socket.off("online:count");
      };
    };

    initSocket();
  }, [user]);

  useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      if (socket && !socket.connected) {
        console.log("🔄 Tab is visible again, reconnecting socket...");
        socket.connect();
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [socket]);

  // Register event listeners
  useEffect(() => {
    if (!socket || !user?.id) return;

    socket.on("tournament:created", (data) => {
      console.log("🎯 Tournament created:", data);
      setTournament((prev) => ({ ...prev, ...data }));
      if (user?.id) {
        console.log(`🔄 Checking participation for created tournament ${data.tid}`);
        socket.emit("checkParticipation", { tid: data.tid, userId: user.id });
      }
    });

    socket.on("tournament:newPlayer", (data) => {
      console.log("👥 New player joined:", data);
      if (data.tournamentId === tournament?.tid) {
        socket.emit("getPlayerCount", { tid: data.tournamentId });
      }
    });

    socket.on("tournament:playerCount", ({ playersCount }) => {
      console.log("👥 Player count updated:", playersCount);
      setNoOfPlayers(playersCount);
    });

    socket.on("vote:error", (err) => {
      console.error("Vote error:", err.message);
      toast.error(err.message);
    });

    socket.on("tournament:joined", ({ tid, room }) => {
      console.log(`✅ Joined room ${room} for tournament ${tid}`);
      setJoined(true);
      toast.success("Successfully joined the tournament!");
      // Verify room membership
      socket.emit("debugRooms", { userId: user.id });
    });

    socket.on("tournament:error", (payload) => {
      console.warn("❌ tournament:error:", payload?.message || payload);
      setJoined(false);
      toast.error(payload?.message || "Failed to join tournament");
    });

    socket.on("tournament:cancelled", ({ tid }) => {
      setTournament((prev) => {
        if (prev?.tid === tid || prev?.id === tid) {
          console.log("⚠️ Tournament cancelled");
          setJoined(false);
          return { ...prev, status: "cancelled" };
        }
        return prev;
      });
      toast.warn("Tournament cancelled");
    });

    socket.on("tournament:starting", (data) => {
      console.log("🚀 Tournament starting:", data);
      toast.info(`Tournament starting in ${data.startsIn / 1000}s...`);
      setNoOfPlayers(data.playersCount);
      setGameTimer(data.startsIn / 1000);
      if (tournament?.tid && user?.id) {
        console.log(`🔄 Verifying participation for tournament ${data.tid}`);
        socket.emit("checkParticipation", { tid: data.tid, userId: user.id });
      }
    });

    socket.on("participationStatus", ({ isParticipant }) => {
      console.log("🎮 Participation status:", isParticipant);
      setJoined(isParticipant);
      if (isParticipant && tournament?.tid) {
        console.log("🎮 Confirmed participant, routing to /game/", tournament.tid);
        router.push(`/game/${tournament.tid}`);
      }
    });

    socket.on("prize:change:window:opened", (data) => {
      console.log("🎁 Prize change window opened:", data);
      toast.info("🎁 Prize change window is now open! Hurry up!");
      setPrizeWindow({ open: true, endsAt: data.endsAt, stats: data.stats });
    });

    socket.on("prize:change:window:closed", (data) => {
      console.log("⏰ Prize change window closed:", data);
      toast.warn("⏰ Prize change window closed!");
      setPrizeWindow({ open: false, endsAt: null, stats: null });
    });

    socket.on("debugRoomsResponse", ({ rooms }) => {
      console.log("🏠 Current socket rooms:", rooms);
    });

    return () => {
      socket.off("tournament:created");
      socket.off("tournament:newPlayer");
      socket.off("tournament:playerCount");
      socket.off("vote:error");
      socket.off("tournament:joined");
      socket.off("tournament:error");
      socket.off("tournament:cancelled");
      socket.off("tournament:starting");
      socket.off("participationStatus");
      socket.off("prize:change:window:opened");
      socket.off("prize:change:window:closed");
      socket.off("debugRoomsResponse");
    };
  }, [socket, user?.id, tournament?.tid, router]);

  // Compute remaining lobby time
  useEffect(() => {
    if (!tournament || !tournament.lobbyEndsAt) return;
    const endTime = new Date(tournament.lobbyEndsAt).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((endTime - now) / 1000));
    console.log("⏱️ Time left:", diff);
    setTimeLeft(diff);
  }, [tournament]);

  // Countdown timer
  useEffect(() => {
    if (!tournament || tournament.status !== "waiting" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [tournament?.status, timeLeft]);

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // READY UP HANDLER
  const disableReadyUp =
    !tournament || tournament.status !== "waiting" || timeLeft <= 0 || joined;

  const handleReadyUp = async (user, prizeId) => {
    if (disableReadyUp) return;
    const tid = tournament?.tid;
    if (!tid) return console.warn("⚠️ No tournament ID found");
    if (!user?.id) return console.warn("⚠️ No user ID found");

    try {
      const res = await axios.post(
        `${url}/api/tournament/join`,
        { userId: user.id, tid: tournament.tid }
      );

      if (res.data?.ok) {
        console.log("✅ Joined tournament in DB");
        setPrizeId(prizeId);
        setSelectedPrize(prizeId);
        socket.emit("tournament:join", { tid, userId: user.id, prizeId });
      } else {
        console.warn("Join response not ok:", res.data);
        setSelectedPrize(null);
        toast.error("Failed to join tournament");
      }
    } catch (err) {
      console.error("Join error:", err?.response?.data || err.message);
      setJoined(false);
      setSelectedPrize(null);
      toast.error("Failed to join tournament");
    }
  };

  const handleSendPrize = async (userId, prizeId, setConfirmed, onClose) => {
    try{
      const response = await axios.post(`${url}/api/prizes/select-prize`, { userId, prizeId });
       console.log("✅ Prize selected:", response.data);
       setUserPrize(response.data.userPrize);
       localStorage.setItem("userPrize", JSON.stringify(response.data.userPrize));
       setConfirmed(true);
       setTimeout(() => {
          onClose();
        }, 2000);
    }catch(err){
      console.error("Select prize error:", err?.response?.data || err.message);
      toast.error("Failed to select prize");  
    }
  }

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
        setPrizeWindow,
        selectedPrize,
        setSelectedPrize,
        joined,
        setJoined,
        gameTimer,
        setGameTimer,
        onlineCount,
        handleSendPrize
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);