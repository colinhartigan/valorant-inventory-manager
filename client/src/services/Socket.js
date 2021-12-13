import React from 'react';

import Config from './ClientConfig';

export var socket = null

export const request = async (data) => {
    // console.log(`requesting ${data.request}`)
    return new Promise((resolve, reject) => {
        if(socket !== null){
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
        } else {
            reject();
        }
    });
};

export async function connect() {
    return new Promise((resolve, reject) => {
        if(socket === null || (socket !== null && socket.readyState !== 1)){
            try {
                console.log("connecting")
                socket = new WebSocket(Config.WEBSOCKET_URL);
                console.log(socket)
                socket.onerror = (event) => {
                    console.log(event)
                    reject();
                    socket = null
                }
                socket.onopen = (event) => {
                    console.log("opened")
                    resolve();
                }
                socket.onmessage = (event) => {
                    console.log("messaged")
                    resolve();
                }
                if (socket.readyState === 1) {
                    console.log("redee")
                    resolve();
                }
            } catch (error) {
                console.log(error)
                socket = null
                reject();
            }
        } else {
            resolve();
        }
    });
} 