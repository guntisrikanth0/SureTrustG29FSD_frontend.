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

    // 2. Pass the URL to the io() function
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      },
      // Adding these options helps prevent connection issues on Render
      transports: ["websocket", "polling"],
      withCredentials: true
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
        if (newSocket) newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};