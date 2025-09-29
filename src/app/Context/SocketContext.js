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

  return (
    <SocketContext.Provider value={{ socket, connected, tournament, setTournament, noOfPlayers, setNoOfPlayers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
