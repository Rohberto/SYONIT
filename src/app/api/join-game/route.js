import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import next from 'next';

// Initialize Next.js app and Express server
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);  // Use the http server here

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",  // Allow all origins for now (modify in production)
      methods: ["GET", "POST"]
    }
  });

  let playersQueue = [];
  let roomId = null;
  const QUEUE_TIMEOUT = 30000; // 30 seconds

  // WebSocket connection handler
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle player joining the game via socket
    socket.on('joinGame', (userId) => {
      playersQueue.push({ userId, timestamp: Date.now() });
      console.log(`Player ${userId} joined the queue`);

      const roomDetails = checkQueueTimeout();
      if (roomDetails) {
        io.emit('roomAssigned', roomDetails);
        socket.emit('roomAssigned', roomDetails);
      } else {
        socket.emit('waitingForPlayers', 'Waiting for more players...');
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  // Function to check if the queue timeout has been reached and assign room
  const checkQueueTimeout = () => {
    const currentTime = Date.now();
    if (playersQueue.length > 0 && currentTime - playersQueue[0].timestamp >= QUEUE_TIMEOUT) {
      return assignRoom();
    }
    return null;
  };

  // Function to assign a room when timeout occurs or enough players are queued
  const assignRoom = () => {
    roomId = `room_${Date.now()}`;
    const assignedPlayers = [...playersQueue];
    playersQueue = [];
    return { roomId, assignedPlayers };
  };

  // POST route for joining the game
  server.post('/api/join-game', express.json(), (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Add player to the queue
    playersQueue.push({ userId, timestamp: Date.now() });

    // Check if enough time has passed or if the game can start
    const roomDetails = checkQueueTimeout();
    if (roomDetails) {
      // Notify all connected WebSocket clients about room assignment
      io.emit('roomAssigned', roomDetails);
      return res.status(200).json(roomDetails);
    }

    // Respond to the player with a waiting message
    return res.status(200).json({ message: 'Waiting for more players...' });
  });

  // Default Next.js request handler for other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  httpServer.listen(5000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
