import { Server } from "socket.io";
import {
  createInitialHand,
  assignSecretColors,
  executeCard,
  calculateScores
} from "./gamelogic/gameEngine.js";

// Global dictionary to store rooms
const gameRooms = {};
const roomIntervals = {}; 
const matchmakingQueue = [];
const pendingMatches = {}; // { matchId: { p1, p2, accepted: [], timer } }
const TIMER_DURATION = 30;
const ACCEPT_TIMEOUT = 12000; // 12 seconds to account for network lag

function assignMatch(io) {
  if (matchmakingQueue.length < 2) return;

  const p1_data = matchmakingQueue.shift();
  const p2_data = matchmakingQueue.shift();

  const matchId = "MATCH-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  
  pendingMatches[matchId] = {
    players: [p1_data, p2_data],
    accepted: [],
    timeout: setTimeout(() => {
      handleMatchSelectionTimeout(io, matchId);
    }, ACCEPT_TIMEOUT)
  };

  io.to(p1_data.socketId).emit("matchFound", { matchId, opponentName: p2_data.name });
  io.to(p2_data.socketId).emit("matchFound", { matchId, opponentName: p1_data.name });
}

function handleMatchSelectionTimeout(io, matchId) {
  const match = pendingMatches[matchId];
  if (!match) return;

  match.players.forEach(p => {
    io.to(p.socketId).emit("matchCancelled", { reason: "Timeout: Players failed to accept" });
  });

  delete pendingMatches[matchId];
}

function createRankedGame(io, matchId) {
  const match = pendingMatches[matchId];
  if (!match) return;

  clearTimeout(match.timeout);

  const roomId = "RANK-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  const p1 = match.players[0];
  const p2 = match.players[1];

  const gameState = {
    roomId,
    status: "playing",
    players: [
      { socketId: p1.socketId, name: p1.name, secretColors: assignSecretColors(), hand: createInitialHand(), score: 0, isHost: true },
      { socketId: p2.socketId, name: p2.name, secretColors: assignSecretColors(), hand: createInitialHand(), score: 0, isHost: false }
    ],
    tikiLine: ["red", "blue", "green", "yellow", "purple", "orange"],
    logs: ["Match Accepted! Competitive battle starting."],
    timeLeft: TIMER_DURATION,
    currentTurnIndex: Math.floor(Math.random() * 2),
    isRanked: true
  };

  gameRooms[roomId] = gameState;
  p1.socket.join(roomId);
  p2.socket.join(roomId);

  io.to(roomId).emit("matchAccepted", { roomId });
  io.to(roomId).emit("gameStateUpdated", gameState);
  startRoomTimer(io, roomId);

  delete pendingMatches[matchId];
}

function startRoomTimer(io, roomId) {
  if (roomIntervals[roomId]) clearInterval(roomIntervals[roomId]);

  const room = gameRooms[roomId];
  if (!room) return;

  room.timeLeft = TIMER_DURATION;
  io.to(roomId).emit("gameStateUpdated", room);

  roomIntervals[roomId] = setInterval(() => {
    const r = gameRooms[roomId];
    if (!r || r.status !== "playing") {
      clearInterval(roomIntervals[roomId]);
      delete roomIntervals[roomId];
      return;
    }

    r.timeLeft -= 1;

    if (r.timeLeft <= 0) {
      clearInterval(roomIntervals[roomId]);
      delete roomIntervals[roomId];

      // Auto-play for the current player
      const currentPlayer = r.players[r.currentTurnIndex];
      if (currentPlayer && currentPlayer.hand.length > 0) {
        const randomCard = currentPlayer.hand[0];
        // If it needs targets, we just pick random colors from the line
        const payload = {
          ...randomCard,
          target1: r.tikiLine[0],
          target2: r.tikiLine[1] || null
        };
        
        handlePlayAction(io, roomId, currentPlayer.socketId, payload);
      }
    }
    
    io.to(roomId).emit("gameStateUpdated", r);
  }, 1000);
}

function handlePlayAction(io, roomId, socketId, cardData) {
  const room = gameRooms[roomId];
  if (!room || room.status !== "playing") return;

  const playerIdx = room.players.findIndex(p => p.socketId === socketId);
  if (playerIdx === -1 || playerIdx !== room.currentTurnIndex) return;

  const player = room.players[playerIdx];
  const handIdx = player.hand.findIndex(c => c.id === cardData.id);
  if (handIdx === -1) return;

  // Execute
  const roundEnded = executeCard(room, player, cardData);
  
  // Remove card from hand
  player.hand.splice(handIdx, 1);

  if (roundEnded || room.players.every(p => p.hand.length === 0)) {
    // Scoring
    room.logs.push("--- Round Ended! Calculating Scores ---");
    calculateScores(room);
    
    // Check if game should end or start new round
    // For now, let's just end the game after one round or reset hands
    // simplified: just end game if someone hits target or everyone played
    room.status = "finished"; 
    room.logs.push("Game Over! Final scores calculated.");
  } else {
    // Next Turn
    room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;
    room.logs.push(`It is now ${room.players[room.currentTurnIndex].name}'s turn.`);
    startRoomTimer(io, roomId);
  }

  io.to(roomId).emit("gameStateUpdated", room);
}

export function setupSocket(server, config) {
  const io = new Server(server, {
    cors: {
      origin: config.frontendUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("createGame", ({ playerName }, callback) => {
      const roomId = "TK-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      
      const hostPlayer = {
        socketId: socket.id,
        name: playerName || `Player-${Math.random().toString(36).substring(2, 5)}`,
        secretColors: assignSecretColors(),
        hand: createInitialHand(),
        score: 0,
        isHost: true,
      };

      const gameState = {
        roomId,
        status: "waiting",
        roundPhase: "play", // selection -> play
        players: [hostPlayer],
        tikiLine: ["red", "blue", "green", "yellow", "purple", "orange"],
        logs: ["Game created. Waiting for players..."],
        timeLeft: 0,
        currentTurnIndex: 0,
      };

      gameRooms[roomId] = gameState;
      socket.join(roomId);
      io.to(roomId).emit("gameStateUpdated", gameState);
      if (callback) callback({ success: true, roomId });
    });

    socket.on("joinGame", ({ roomId, playerName }, callback) => {
      const room = gameRooms[roomId];
      if (!room || room.status !== "waiting") {
        return callback && callback({ success: false, message: "Room not found or in progress" });
      }
      
      if (room.players.length >= 4) {
        return callback && callback({ success: false, message: "Room is full" });
      }

      const player = {
        socketId: socket.id,
        name: playerName || `Player-${Math.random().toString(36).substring(2, 5)}`,
        secretColors: assignSecretColors(),
        hand: createInitialHand(),
        score: 0,
        isHost: false,
      };

      room.players.push(player);
      room.logs.push(`${player.name} joined.`);
      socket.join(roomId);
      io.to(roomId).emit("gameStateUpdated", room);
      if (callback) callback({ success: true, roomId });
    });

    socket.on("startGame", ({ roomId }, callback) => {
      const room = gameRooms[roomId];
      if (!room) return;
      
      const host = room.players[0];
      if (host.socketId !== socket.id) return;

      if (room.players.length < 2) {
        return callback && callback({ success: false, message: "Need at least 2 players" });
      }

      room.status = "playing";
      room.currentTurnIndex = Math.floor(Math.random() * room.players.length);
      room.logs.push(`The game has started! ${room.players[room.currentTurnIndex].name} goes first.`);
      
      startRoomTimer(io, roomId);
      io.to(roomId).emit("gameStateUpdated", room);
      if (callback) callback({ success: true });
    });

    socket.on("playCard", ({ roomId, card }, callback) => {
      handlePlayAction(io, roomId, socket.id, card);
      if (callback) callback({ success: true });
    });

    socket.on("getGameState", (callback) => {
      const roomId = Array.from(socket.rooms).find(r => r.startsWith("TK-"));
      if (roomId && gameRooms[roomId]) {
        callback(gameRooms[roomId]);
      } else {
        callback(null);
      }
    });

    socket.on("leaveGame", ({ roomId }) => {
      const room = gameRooms[roomId];
      if (!room) return;
      
      const idx = room.players.findIndex(p => p.socketId === socket.id);
      if (idx !== -1) {
        const pName = room.players[idx].name;
        room.logs.push(`${pName} left.`);
        room.players.splice(idx, 1);
        io.to(roomId).emit("opponentLeft", { name: pName });
        socket.leave(roomId);

        if (room.players.length === 0) {
          delete gameRooms[roomId];
        } else {
          if (!room.players.some(p => p.isHost)) room.players[0].isHost = true;
          // If the active player left, move to next
          if (room.currentTurnIndex >= room.players.length) room.currentTurnIndex = 0;
          io.to(roomId).emit("gameStateUpdated", room);
        }
      }
    });

    socket.on("disconnect", () => {
      // Remove from matchmaking queue
      const queueIdx = matchmakingQueue.findIndex(p => p.socketId === socket.id);
      if (queueIdx !== -1) {
        matchmakingQueue.splice(queueIdx, 1);
        console.log(`Player removed from queue: ${socket.id}`);
      }

      Object.keys(gameRooms).forEach((roomId) => {
        const room = gameRooms[roomId];
        const idx = room.players.findIndex(p => p.socketId === socket.id);
        if (idx !== -1) {
          const pName = room.players[idx].name;
          room.logs.push(`${pName} disconnected.`);
          io.to(roomId).emit("opponentLeft", { name: pName });
          room.players.splice(idx, 1);
          if (room.players.length === 0) {
             delete gameRooms[roomId];
          } else {
             if (!room.players.some(p => p.isHost)) room.players[0].isHost = true;
             if (room.currentTurnIndex >= room.players.length) room.currentTurnIndex = 0;
             io.to(roomId).emit("gameStateUpdated", room);
          }
        }
      });
    });

    socket.on("findMatch", ({ playerName, elo }) => {
      // Avoid duplicate entry
      if (matchmakingQueue.some(p => p.socketId === socket.id)) return;

      matchmakingQueue.push({
        socketId: socket.id,
        socket,
        name: playerName,
        elo: elo || 1200
      });
      console.log(`Player joined queue: ${playerName} (${socket.id})`);
      
      assignMatch(io);
    });

    socket.on("cancelMatchmaking", () => {
      const idx = matchmakingQueue.findIndex(p => p.socketId === socket.id);
      if (idx !== -1) {
        matchmakingQueue.splice(idx, 1);
        console.log(`Matchmaking cancelled for: ${socket.id}`);
      }
    });

    socket.on("acceptMatch", ({ matchId }) => {
      const match = pendingMatches[matchId];
      if (!match) return;

      if (!match.accepted.includes(socket.id)) {
        match.accepted.push(socket.id);
        
        if (match.accepted.length === 2) {
          createRankedGame(io, matchId);
        } else {
          // Notify other player that this player accepted
          const other = match.players.find(p => p.socketId !== socket.id);
          if (other) io.to(other.socketId).emit("opponentAccepted");
        }
      }
    });

    socket.on("declineMatch", ({ matchId }) => {
      const match = pendingMatches[matchId];
      if (!match) return;

      match.players.forEach(p => {
        io.to(p.socketId).emit("matchCancelled", { reason: "A player declined the match." });
      });

      delete pendingMatches[matchId];
    });
  });

  return io;
}
