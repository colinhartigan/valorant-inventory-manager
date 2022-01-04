import React from 'react';

import {Config} from './ClientConfig';

class Socket {
    constructor() {
        this.socket = null
        this.subscriptions = {}
        this.listening = false
    }

    async connect() {
        this.listening = false;
        return new Promise((resolve, reject) => {
            if (this.socket === null || (this.socket !== null && this.socket.readyState !== 1)) {
                try {
                    console.log("connecting")
                    this.socket = new WebSocket(Config.WEBSOCKET_URL);
                    console.log(this.socket)
                    this.socket.onerror = (event) => {
                        console.log(event)

                        socket = null
                        return reject();
                    }
                    this.socket.onopen = (event) => {
                        console.log("opened")
                        console.log(this.socket)
                        this.messageHandler()
                        return resolve();
                    }
                } catch (error) {
                    console.log("rip")
                    this.socket = null;
                    return reject();
                }
            } else {
                return resolve();
            }
        })
    }

    async send(data) {
        if (this.socket !== null) {
            try {
                // console.log(`sending request for ${data.request}`)
                this.socket.send(JSON.stringify(data));
            } catch {
                console.log("you fucking moron this state should never occur")
            }
        } else {

        }
    }

    async request(data, callback) {
        if (this.socket !== null) {
            try {
                // console.log(`sending request for ${data.request}`)
                this.socket.send(JSON.stringify(data));
            } catch {
                console.log("you fucking moron this state should never occur")
                return false;
            }

            this.subscribe(data.request, callback, true)
        } else {
            return false
        }
    }

    subscribe(event, callback, removable = false, type = "message") {
        if (this.subscriptions[event] === undefined) {
            this.subscriptions[event] = []
        }
        //check if the callback is already in the subscriptions for the event
        var existing = false
        for (const action in this.subscriptions[event]) {
            if (action.callback === callback){
                existing = true
            }
        }
        console.log(`existing for ${event}: ${existing}`)
        if(existing === false) {
            this.subscriptions[event].push({
                "callback": callback,
                "removable": removable,
                "type": type,
            })
        }
        
        //console.log(this.subscriptions) 
    }
    unsubscribe(event, callback) {
        if (this.subscriptions[event] !== undefined) {
            this.subscriptions[event] = this.subscriptions[event].filter(action => action.callback !== callback)
        }
        if (this.subscriptions[event].length === 0) {
            delete this.subscriptions[event]
        } 
    }

    messageHandler() {
        if (!this.listening) {
            this.listening = true
            this.socket.onmessage = async (event) => {
                const response = JSON.parse(event.data);
                console.log(response)
                Object.keys(this.subscriptions).forEach(subscribedEvent => {
                    if (response.event === subscribedEvent) {
                        for (const action of this.subscriptions[subscribedEvent]) {
                            if (action.type === "message") {
                                action.callback(response.data)
                                if (action.removable) {
                                    this.unsubscribe(subscribedEvent, action.callback)
                                }
                            }
                        }
                    }
                })
            }
            this.socket.onclose = async (event) => {
                console.log("closed")
                for (const action of this.subscriptions["onclose"]) {
                    console.log(action)
                    if (action.type === "onclose") {
                        action.callback()
                        if (action.removable) {
                            this.unsubscribe("onclose", action.callback)
                        }
                    }
                }
            }
        }
    }
}

var socket = new Socket()
export default socket