import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

// Create the socket instance but don't auto-connect until first use
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
