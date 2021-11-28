import React from 'react';

//export const socket = new WebSocket("ws://localhost:8765");
export const socket = new WebSocket("ws://71.179.88.140:8765")
export const SocketContext = React.createContext(); 

export const request = async (data) => {
    // console.log(`requesting ${data.request}`)
    return new Promise((resolve, reject) => {
        try{
            // console.log(`sending request for ${data.request}`)
            socket.send(JSON.stringify(data));
        } catch {
            console.log("you fucking moron this state should never occur")
            reject("error");
        }
        // console.log(`awaiting response for ${data.request}`)
        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            
            if (response.request === data.request){
                // console.log(`request ${data.request} got response for ${response.request}`);
                if (response.error) {
                    reject(response);
                } else {
                    // console.log(`request ${data.request} resolved`)
                    resolve(response);
                }
            };
        };
    });
};