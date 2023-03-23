import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import BuddyEditor from '../components/buddyEditor/BuddyEditor.js'
import Buddies from '../components/buddies/Buddies.js'

import { Grid, Container, Typography, Snackbar } from '@mui/material'

import socket from "../services/Socket";
import { useLoadout } from '../services/useLoadout.js';
import { useInventory } from '../services/useInventory.js';
import SnackbarFeedback from '../components/snackbarFeedback/SnackbarFeedback.js';

const useStyles = makeStyles((theme) => ({

}));


function CollectionHome(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [loadout, forceUpdateLoadout] = useLoadout();
    const [inventory, forceUpdateInventory] = useInventory()

    const [buddyEditor, setBuddyEditor] = useState(null);

    const [snackbarTrigger, setSnackbarTrigger] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");

    useEffect(() => {
        document.title = "VIM // Buddies"
    }, []);

    async function saveCallback(uuid, name, payload) {
        return new Promise((resolve, reject) => {
            function loadoutCallback(response) {
                console.log("loadout put")
                forceUpdateLoadout(response);

            }

            function inventoryCallback(response) {
                console.log("inventory put")

                var newInventory = { ...inventory }
                newInventory.buddies[uuid] = payload.buddyData;
                forceUpdateInventory(newInventory);

                setSnackbarText("Saved changes to " + name)
                setSnackbarTrigger(true);

                resolve();
            }

            var inventoryChange = {
                "buddyUuid": uuid,
                "newData": payload.buddyData
            }

            socket.request({ "request": "put_buddies", "args": { "payload": JSON.stringify(payload.loadout) } }, loadoutCallback);
            socket.request({ "request": "update_buddy_inventory", "args": { "payload": JSON.stringify(inventoryChange) } }, inventoryCallback);
        })
    }

    async function favoriteCallback(uuid, payload) {
        return new Promise((resolve, reject) => {
            function inventoryCallback(response) {
                resolve();
            }

            var inventoryChange = {
                "buddyUuid": uuid,
                "newData": payload
            }

            socket.request({ "request": "update_buddy_inventory", "args": { "payload": JSON.stringify(inventoryChange) } }, inventoryCallback);
        })
    }

    async function favoriteAllCallback(fave){
        return new Promise((resolve, reject) => {
            function inventoryCallback(response) {
                forceUpdateInventory(response,"buddies");
            }

            var payload = {
                "favorite": fave
            }
            socket.request({ "request": "favorite_all_buddies", "args": { "payload": JSON.stringify(payload) } }, inventoryCallback);
        })
    }

    function openEditor(uuid) {
        console.log(uuid);
        setBuddyEditor(<BuddyEditor data={inventory.buddies[uuid]} loadout={loadout} inventory={inventory} saveCallback={saveCallback} closeEditor={closeEditor} />)
    }

    function closeEditor() {
        setBuddyEditor(null);
    }

    return (
        <>
            <SnackbarFeedback trigger={snackbarTrigger} setTrigger={setSnackbarTrigger} type="success" text={snackbarText}/>
            <div style={{ width: "100%", height: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1 }}>
                <Container maxWidth={null} style={{ height: "100%", display: "flex", flexGrow: 1, }}>
                    {buddyEditor}
                    <Buddies loadout={loadout} inventory={inventory.buddies} buddyEditorCallback={openEditor} favoriteCallback={favoriteCallback} favoriteAllCallback={favoriteAllCallback} />
                </Container>
            </div>
        </>
    )
}


export default CollectionHome