import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import BuddyEditor from '../components/buddyEditor/BuddyEditor.js'
import Buddies from '../components/buddies/Buddies.js'

import { Grid, Container, Typography } from '@material-ui/core'

import socket from "../services/Socket";
import { useLoadout } from '../services/useLoadout.js';
import { useInventory } from '../services/useInventory.js';

const useStyles = makeStyles((theme) => ({

}));


function CollectionHome(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [loadout, setLoadout, forceUpdateLoadout] = useLoadout();
    const [inventory, setInventory, forceUpdateInventory] = useInventory()

    const [buddyEditor, setBuddyEditor] = useState(null);

    useEffect(() => {
        document.title = "VIM // Buddies"
    }, []);

    function saveCallback(payload){
        setBuddyEditor(null)
    }

    function openEditor(uuid){
        console.log(uuid);
        setBuddyEditor(<BuddyEditor data={inventory.buddies[uuid]} loadout={loadout} saveCallback={saveCallback}/>)
    }

    return (
        <>
            <div style={{ width: "100%", height: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1 }}>
                <Container maxWidth={null} style={{ height: "100%", display: "flex", flexGrow: 1, }}>
                    {buddyEditor}
                    <Buddies loadout={loadout} inventory={inventory.buddies} buddyEditorCallback={openEditor}/>
                </Container>
            </div>
        </>
    )
}


export default CollectionHome