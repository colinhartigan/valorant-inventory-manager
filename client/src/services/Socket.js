import React from 'react';

export const socket = new WebSocket("ws://71.179.88.140:8765");
export const SocketContext = React.createContext(); 

export const request = (data) => {
    return new Promise((resolve, reject) => {
        try{
            socket.send(JSON.stringify(data));
        } catch {
            reject("error");
        }
        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.error) {
                reject(response);
            } else {
                resolve(response);
            }
        };
    });
};