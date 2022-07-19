import { createContext, useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

import socket from "./Socket";

const { useGlobalState } = createGlobalState({ inventory: { "cum": "cum" } });

function useInventoryRunner() {
    const [inventory, setInventory] = useGlobalState('inventory');

    function updatedInventoryCallback(response) {
        console.log(response)
        setInventory(response)
    }

    useEffect(() => {
        socket.request({ "request": "fetch_inventory" }, updatedInventoryCallback)
    }, []);

    return [inventory]
}

function useInventory(){
    const [inventory, setInventory] = useGlobalState('inventory');

    function forceUpdateInventory(response, type=null){
        if(type !== null){
            setInventory({...inventory, [type]: response})
        } else {
            setInventory(response)
        }
    }

    return [inventory, forceUpdateInventory]
}

export { useInventoryRunner, useInventory };