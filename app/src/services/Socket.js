import React from 'react';

export const socket = new WebSocket("ws://71.179.88.140:8765");
export const SocketContext = React.createContext(); 