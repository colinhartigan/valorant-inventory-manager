import { createContext, useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

import socket from "./Socket";

const { useGlobalState } = createGlobalState({ loadout: { "cum": "cum" } });

function useLoadoutRunner() {
    const [loadout, setLoadout] = useGlobalState('loadout');

    function updatedLoadoutCallback(response) {
        console.log(response)
        setLoadout(response.loadout)
    }

    useEffect(() => {
        socket.subscribe("loadout_updated", updatedLoadoutCallback)
        socket.request({ "request": "fetch_loadout" }, updatedLoadoutCallback);
    }, []);

    return [loadout]
}

function useLoadout(){
    const [loadout, setLoadout] = useGlobalState('loadout');

    function forceUpdateLoadout(response){
        setLoadout(response.loadout)
    }

    return [loadout, forceUpdateLoadout]
}

export { useLoadoutRunner, useLoadout };