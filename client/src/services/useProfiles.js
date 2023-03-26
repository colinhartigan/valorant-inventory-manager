import { createContext, useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import useLocalStorage from './useLocalStorage';

import socket from "./Socket";

const { useGlobalState } = createGlobalState({ profile: {}, profileMetas: [] });

function useProfilesRunner() {
    const [savedProfileUuid, setSavedProfileUuid] = useLocalStorage('profile', 0);
    const [profile, setProfile] = useGlobalState('profile');
    const [profileMetas, setProfileMetas] = useGlobalState('profileMetas');

    function updatedProfileMetaCallback(response) {
        setProfileMetas(response)
    }

    function updateProfile(response){
        setProfile(response)
    }

    function equipProfile(response){
        
    }

    useEffect(() => {
        socket.request({ "request": "fetch_profile_metadatas" }, updatedProfileMetaCallback)
        socket.request({ "request": "fetch_profile", "args": { "profile_uuid": savedProfileUuid } }, updateProfile)
        socket.request({ "request": "apply_profile", "args": { "profile_uuid": savedProfileUuid } }, equipProfile)
    }, []);

    return [profile]
}

function useProfileMetas(){
    const [profileMetas, setProfileMetas] = useGlobalState('profileMetas');

    function forceUpdateProfilesMeta(response){
        setProfileMetas(response)
    }

    return [profileMetas, forceUpdateProfilesMeta]
}

function useProfile(){
    const [profile, setProfile] = useGlobalState('profile');

    function forceUpdateProfile(response){
        setProfile(response)
    }

    return [profile, forceUpdateProfile]
}

export { useProfilesRunner, useProfileMetas, useProfile };