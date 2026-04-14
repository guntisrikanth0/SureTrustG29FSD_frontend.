import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Determine the correct backend URL
    const SOCKET_URL = window.location.hostname === "localhost" 
      ? "http://localhost:5000" 
      : "https://suretrustg29fsd-backend-qgln.onrender.com";

    // 2. Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      },
      // IMPORTANT: Polling first, then WebSocket. 
      // This prevents the 404 error during Render's cold start.
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    // Debugging logs
    newSocket.on("connect", () => {
      console.log("✅ Socket Connected to:", SOCKET_URL);
    });

    newSocket.on("connect_error", (error) => {
      console.warn("⚠️ Socket connection error (retrying...):", error.message);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};