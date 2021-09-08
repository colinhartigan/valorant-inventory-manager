import React from 'react';

export const socket = new WebSocket("ws://localhost:8765");
export const SocketContext = React.createContext(); 