import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000"; // change to your backend URL

// Create the socket instance but don't auto-connect until first use
const socket = io(SOCKET_URL, {
  autoConnect: false, 
});

export default socket;
