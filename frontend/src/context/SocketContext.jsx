import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const backendUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    const newSocket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket Connected to:", backendUrl);
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("connect_error", (err) => {
      console.warn("❌ Socket Connection Error:", err.message);
      setError(err.message);
      setIsConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket Disconnected:", reason);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.off("disconnect");
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
};
