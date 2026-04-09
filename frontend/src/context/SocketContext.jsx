import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to backend
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"], // ensure fallback transports
      reconnectionAttempts: 5,
    });

    // We are ignoring initial connection errors to prevent UI blocking
    newSocket.on("connect_error", (err) => {
      console.warn("Socket Connection Warning:", err.message);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
