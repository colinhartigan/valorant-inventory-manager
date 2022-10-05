import { createContext, useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

import socket from "./Socket";

const { useGlobalState } = createGlobalState({ config: null });

function useConfigRunner() {
    const [config, setConfig] = useGlobalState('config');

    function configFetchedCallback(response) {
        console.log(response)
        setConfig(response)
    }

    function activate(){
        socket.request({ "request": "fetch_config" }, configFetchedCallback)
    }

    return [config, activate]
}

function useConfig(){
    const [config, setConfig] = useGlobalState('config');

    function updateConfig(newConfig){
        setConfig(newConfig)
    }

    function publishConfig(callback){
        socket.request({ "request": "update_config", "args": { "new_config": config } }, callback)
    }

    return [config, updateConfig, publishConfig]
}

export { useConfigRunner, useConfig };