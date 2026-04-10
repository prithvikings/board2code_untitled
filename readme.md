# Tiki Topple: Tactical Web Game

![Tiki Topple Hero](https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop)

A sleek, real-time multiplayer implementation of the classic strategy board game **Tiki Topple**, fully modernized with a premium cyberpunk & dark-tactical aesthetic.

Out-maneuver your opponents, strategically position your assigned Tiki Idols to match your secret logic rules, and score massive points using **Tactical Scoring** mechanics.

---

## 🚀 Key Features

*   **Three Diverse Play Modes:**
    *   **Local Co-Op:** Classic pass-and-play matches handled locally on a single machine.
    *   **Bot Match:** Test your skills against an AI opponent featuring dynamic play styles and difficulties.
    *   **Custom Lobbies (Multiplayer):** Real-time online matches via private room codes where you can challenge opponents over secure WebSockets.
*   **Fully Modern UI/UX:**
    *   Designed exclusively with a dark premium palette (`#0a0a0a`, `#18181b`) and bold contrasting accents (lime green & tactical neon yellow).
    *   Smooth layout animations powered by **Framer Motion**, ensuring fluid movements of the Tiki tokens along the board.
    *   Dynamic sizing, aspect-ratio locked cards, and responsive grids ensure the complete game fits perfectly in your window without requiring excessive scrolling.
*   **Deep Strategic Mechanics:**
    *   **Action Cards:** Secretly lock in 2 cards per turn (Up, Swap, or Topple constraints) to manipulate the board stack.
    *   **Tactical Rules:** Instead of generic matching, players are assigned dynamic logical conditions (e.g., *"BLUE must be ABOVE position 2"*) directly impacting multiplier scoring.
    *   **Configurable Win Logic:** Establish a custom target score threshold upon lobby creation (e.g., First to 50 points wins).

---

## 🛠️ Technology Stack

**Frontend Architecture:**
*   **React (Vite):** Blazing fast component rendering and state syncing.
*   **TailwindCSS:** Granular styling avoiding generic layouts in favor of curated component isolation.
*   **Framer Motion:** High-fidelity layout transitions for token board updates.
*   **Phosphor Icons:** Professional iconography replacing generic emojis.

**Backend Infrastructure:**
*   **Node.js / Express:** Robust, lightweight API framing.
*   **Socket.IO:** Low-latency real-time state synchronization, handling room handshakes, lock-ins, and match resolution logic across distant clients.

---

## ⚙️ Installation & Getting Started

To run Tiki Topple locally, you will need two separate terminal windows—one for the backend server and one for the frontend client.

### 1. The Backend (Game Server & WebSockets)
Open your first terminal and navigate to the backend directory:

```bash
cd backend
npm install
npm run dev
```
*The server will typically start on `http://localhost:5000` listening for Socket events.*

### 2. The Frontend (Client)
Open your second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```
*Your frontend will boot up (typically at `http://localhost:5173` or `5174`). Open this link in your browser to access the game.*

---

## 🎮 How to Play

1.  **Enter the Dashboard:** Select your preferred mode (Bot, Local, or Custom Multi).
2.  **Lobby Config:** Use the `+ / -` dials to set the target point threshold for the match.
3.  **Review Rules:** Once the match begins, quickly check your hidden *Tactical Rules* on the left panel (this tells you what colors you need to boost or drop).
4.  **Select Action Cards:** You are dealt a hand containing Move, Swap, and Topple cards. Click two cards and choose your targets on the physical board.
5.  **Lock In:** Once selected, hit lock-in. When all players verify, the turn executes concurrently Phase A then Phase B, updating the board dynamically. Points are distributed based on rule logic!

---
*Developed with a focus on high-performance multiplayer synchronization and premium UI aesthetics.*