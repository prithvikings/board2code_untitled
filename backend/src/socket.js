import { Server } from "socket.io";
import {
  createInitialHand,
  assignSecretColors,
  generatePlayerRoundRules,
  generateInitialTikiLine,
  resolveRound,
  calculateAntiGravityScore
} from "./gamelogic/gameEngine.js";

// Global dictionary to store rooms
const gameRooms = {};
const matchmakingQueue = [];
const pendingMatches = {}; // { matchId: { p1, p2, accepted: [], timer } }
const ACCEPT_TIMEOUT = 12000;

function assignMatch(io) {
  if (matchmakingQueue.length < 2) return;

  const p1_data = matchmakingQueue.shift();
  const p2_data = matchmakingQueue.shift();

  const matchId =
    "MATCH-" + Math.random().toString(36).substring(2, 6).toUpperCase();

  pendingMatches[matchId] = {
    players: [p1_data, p2_data],
    accepted: [],
    timeout: setTimeout(() => {
      handleMatchSelectionTimeout(io, matchId);
    }, ACCEPT_TIMEOUT),
  };

  io.to(p1_data.socketId).emit("matchFound", {
    matchId,
    opponentName: p2_data.name,
  });
  io.to(p2_data.socketId).emit("matchFound", {
    matchId,
    opponentName: p1_data.name,
  });
}

function handleMatchSelectionTimeout(io, matchId) {
  const match = pendingMatches[matchId];
  if (!match) return;

  match.players.forEach((p) => {
    io.to(p.socketId).emit("matchCancelled", {
      reason: "Timeout: Players failed to accept",
    });
  });

  delete pendingMatches[matchId];
}

function createRankedGame(io, matchId) {
  const match = pendingMatches[matchId];
  if (!match) return;

  clearTimeout(match.timeout);

  const roomId =
    "RANK-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  const p1 = match.players[0];
  const p2 = match.players[1];

  const p1Colors = assignSecretColors();
  const p2Colors = assignSecretColors();

  const gameState = {
    roomId,
    status: "playing",
    roundPhase: "selecting",
    currentRound: 1,
    targetScore: p1.targetScore || 50,
    players: [
      {
        socketId: p1.socketId,
        name: p1.name,
        hand: createInitialHand(),
        totalScore: 0,
        roundScore: 0,
        isHost: true,
        roundColors: p1Colors,
        rules: generatePlayerRoundRules(p1Colors),
        selectedCards: [],
        hasSelected: false,
        readyForNext: false,
        scoreHistory: [],
      },
      {
        socketId: p2.socketId,
        name: p2.name,
        hand: createInitialHand(),
        totalScore: 0,
        roundScore: 0,
        isHost: false,
        roundColors: p2Colors,
        rules: generatePlayerRoundRules(p2Colors),
        selectedCards: [],
        hasSelected: false,
        readyForNext: false,
        scoreHistory: [],
      },
    ],
    tikiLine: generateInitialTikiLine(),
    logs: ["Match Accepted! Competitive battle starting."],
  };

  gameRooms[roomId] = gameState;
  p1.socket.join(roomId);
  p2.socket.join(roomId);

  io.to(roomId).emit("matchAccepted", { roomId });
  io.to(roomId).emit("gameStateUpdated", gameState);

  delete pendingMatches[matchId];
}

function triggerResolution(io, roomId) {
  const room = gameRooms[roomId];
  if (!room) return;

  room.roundPhase = "resolving";
  room.logs.push("--- Resolution starting ---");

  const { steps, finalLine } = resolveRound(room.tikiLine, room.players);
  
  // Calculate final scores
  const scoreData = room.players.map((p) => {
    const { score, breakdown } = calculateAntiGravityScore(finalLine, p.rules);
    p.roundScore = score;
    p.totalScore += score;
    p.scoreHistory.push(score);

    return {
      socketId: p.socketId,
      name: p.name,
      roundScore: score,
      totalScore: p.totalScore,
      rules: p.rules,
      roundColors: p.roundColors,
      breakdown,
    };
  });

  room.tikiLine = finalLine;
  room.status = room.players.some(p => p.totalScore >= room.targetScore) ? "game_over" : "playing";

  io.to(roomId).emit("roundResolved", { steps, finalLine, scoreData, newStatus: room.status });
  
  room.roundPhase = "round_scoring"; 
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

    socket.on("createGame", ({ playerName, targetScore }, callback) => {
      const roomId =
        "TK-" + Math.random().toString(36).substring(2, 6).toUpperCase();

      const pColors = assignSecretColors();

      const hostPlayer = {
        socketId: socket.id,
        name: playerName || `Player-${Math.random().toString(36).substring(2, 5)}`,
        hand: createInitialHand(),
        totalScore: 0,
        roundScore: 0,
        isHost: true,
        roundColors: pColors,
        rules: generatePlayerRoundRules(pColors),
        selectedCards: [],
        hasSelected: false,
        readyForNext: false,
        scoreHistory: []
      };

      const gameState = {
        roomId,
        status: "waiting",
        roundPhase: "selecting",
        currentRound: 1,
        targetScore: targetScore || 50,
        players: [hostPlayer],
        tikiLine: generateInitialTikiLine(),
        logs: ["Game created. Waiting for players..."],
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

      const pColors = assignSecretColors();
      const player = {
        socketId: socket.id,
        name: playerName || `Player-${Math.random().toString(36).substring(2, 5)}`,
        hand: createInitialHand(),
        totalScore: 0,
        roundScore: 0,
        isHost: false,
        roundColors: pColors,
        rules: generatePlayerRoundRules(pColors),
        selectedCards: [],
        hasSelected: false,
        readyForNext: false,
        scoreHistory: []
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

      const host = room.players.find(p => p.isHost);
      if (!host || host.socketId !== socket.id) return;

      if (room.players.length < 2) {
        return callback && callback({ success: false, message: "Need at least 2 players" });
      }

      room.status = "playing";
      room.roundPhase = "selecting";
      room.tikiLine = generateInitialTikiLine(); // clean start
      room.logs.push("The game has started! Selection phase begins.");

      io.to(roomId).emit("gameStateUpdated", room);
      if (callback) callback({ success: true });
    });

    socket.on("lockInCards", ({ roomId, selectedCards }, callback) => {
      const room = gameRooms[roomId];
      if (!room || room.status !== "playing" || room.roundPhase !== "selecting") return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player || player.hasSelected) return;

      player.selectedCards = selectedCards;
      player.hasSelected = true;
      player.hand = player.hand.filter(h => !selectedCards.find(c => c.id === h.id));
      
      room.logs.push(`${player.name} locked in their actions.`);
      io.to(roomId).emit("gameStateUpdated", room);

      if (room.players.every((p) => p.hasSelected)) {
        triggerResolution(io, roomId);
      }

      if (callback) callback({ success: true });
    });

    socket.on("readyForNextRound", ({ roomId }, callback) => {
      const room = gameRooms[roomId];
      if (!room || (room.roundPhase !== "round_scoring" && room.status !== "game_over")) return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player) return;

      player.readyForNext = true;
      io.to(roomId).emit("gameStateUpdated", room);

      if (room.players.every((p) => p.readyForNext)) {
        if (room.status === "game_over") {
            // Replay Match
            room.currentRound = 1;
            room.status = "playing";
            room.roundPhase = "selecting";
            room.tikiLine = generateInitialTikiLine();
            room.logs = ["A new match has begun!"];
            room.players.forEach(p => {
               p.totalScore = 0;
               p.roundScore = 0;
               p.scoreHistory = [];
               const colors = assignSecretColors();
               p.roundColors = colors;
               p.rules = generatePlayerRoundRules(colors);
               p.hand = createInitialHand();
               p.selectedCards = [];
               p.hasSelected = false;
               p.readyForNext = false;
            });
        } else {
            // Next Round
            room.currentRound++;
            room.roundPhase = "selecting";
            room.tikiLine = generateInitialTikiLine();
            room.logs.push(`Round ${room.currentRound} starting.`);
            room.players.forEach(p => {
                const colors = assignSecretColors();
                p.roundColors = colors;
                p.rules = generatePlayerRoundRules(colors);
                p.hand = createInitialHand();
                p.selectedCards = [];
                p.hasSelected = false;
                p.readyForNext = false;
                p.roundScore = 0;
            });
        }

        io.to(roomId).emit("gameStateUpdated", room);
      }
      
      if (callback) callback({ success: true });
    });

    socket.on("getGameState", (callback) => {
      const roomId = Array.from(socket.rooms).find((r) => r.startsWith("TK-") || r.startsWith("RANK-") || r.startsWith("MATCH-"));
      if (roomId && gameRooms[roomId]) {
        callback(gameRooms[roomId]);
      } else {
        callback(null);
      }
    });

    socket.on("leaveGame", ({ roomId }) => {
      const room = gameRooms[roomId];
      if (!room) return;

      const idx = room.players.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) {
        const pName = room.players[idx].name;
        room.logs.push(`${pName} left.`);
        room.players.splice(idx, 1);
        io.to(roomId).emit("opponentLeft", { name: pName });
        socket.leave(roomId);

        if (room.players.length === 0) {
          delete gameRooms[roomId];
        } else {
          if (!room.players.some((p) => p.isHost))
            room.players[0].isHost = true;
          io.to(roomId).emit("gameStateUpdated", room);
        }
      }
    });

    socket.on("disconnect", () => {
      const queueIdx = matchmakingQueue.findIndex(
        (p) => p.socketId === socket.id,
      );
      if (queueIdx !== -1) {
        matchmakingQueue.splice(queueIdx, 1);
        console.log(`Player removed from queue: ${socket.id}`);
      }

      Object.keys(gameRooms).forEach((roomId) => {
        const room = gameRooms[roomId];
        const idx = room.players.findIndex((p) => p.socketId === socket.id);
        if (idx !== -1) {
          const pName = room.players[idx].name;
          room.logs.push(`${pName} disconnected.`);
          io.to(roomId).emit("opponentLeft", { name: pName });
          room.players.splice(idx, 1);
          if (room.players.length === 0) {
            delete gameRooms[roomId];
          } else {
            if (!room.players.some((p) => p.isHost))
              room.players[0].isHost = true;
            io.to(roomId).emit("gameStateUpdated", room);
          }
        }
      });
    });

    socket.on("findMatch", ({ playerName, elo, targetScore }) => {
      if (matchmakingQueue.some((p) => p.socketId === socket.id)) return;
      matchmakingQueue.push({
        socketId: socket.id,
        socket,
        name: playerName,
        elo: elo || 1200,
        targetScore: targetScore || 50,
      });
      assignMatch(io);
    });

    socket.on("cancelMatchmaking", () => {
      const idx = matchmakingQueue.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) matchmakingQueue.splice(idx, 1);
    });

    socket.on("acceptMatch", ({ matchId }) => {
      const match = pendingMatches[matchId];
      if (!match) return;

      if (!match.accepted.includes(socket.id)) {
        match.accepted.push(socket.id);

        if (match.accepted.length === 2) {
          createRankedGame(io, matchId);
        } else {
          const other = match.players.find((p) => p.socketId !== socket.id);
          if (other) io.to(other.socketId).emit("opponentAccepted");
        }
      }
    });

    socket.on("declineMatch", ({ matchId }) => {
      const match = pendingMatches[matchId];
      if (!match) return;

      match.players.forEach((p) => {
        io.to(p.socketId).emit("matchCancelled", {
          reason: "A player declined the match.",
        });
      });

      delete pendingMatches[matchId];
    });
  });

  return io;
}
