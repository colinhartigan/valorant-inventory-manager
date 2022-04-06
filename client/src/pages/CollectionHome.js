import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import Header from '../components/misc/Header.js'
import Footer from '../components/misc/Footer.js'
import WeaponEditor from '../components/weaponEditor/WeaponEditor.js'
import Collection from '../components/collection/Collection.js'

import socket from "../services/Socket";
import { useLoadout } from "../services/useLoadout"
import { useInventory } from "../services/useInventory"

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

}));


function CollectionHome(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [loadout, setLoadout, forceUpdateLoadout] = useLoadout();
    const [inventory, setInventory, forceUpdateInventory] = useInventory()

    const [loaded, setLoaded] = useState(false);
    const [showWeaponEditor, setWeaponEditorState] = useState(false);

    const [weaponEditor, setWeaponEditor] = useState();
    const [uniqueSkinsOwned, setUniqueSkinsOwned] = useState(-1);

    useEffect(() => {
        console.log(inventory)
    }, [])

    useEffect(() => {
        if (!showWeaponEditor) {
            document.title = "VIM // Collection"
        }
    }, [showWeaponEditor])

    useEffect(() => {
        // count how many skins are owned for skin changer warning dialog
        var skinsOwned = -1;

        for (var weapon in inventory.skins) {
            skinsOwned += Object.keys(inventory.skins[weapon].skins).length - 1;
        }
        if (skinsOwned !== -1) {
            setUniqueSkinsOwned(skinsOwned + 1);
        }
    }, [inventory.skins])

    function modificationMenu(uuid) {
        console.log(inventory)
        setWeaponEditorState(true);
        setWeaponEditor(<WeaponEditor weaponUuid={uuid} initialSkinData={loadout[uuid]} inventoryData={inventory.skins} loadoutWeaponData={loadout[uuid]} saveCallback={saveCallback} closeEditor={closeEditor} />)
    };

    async function saveCallback(payload, sameSkin) {
        return new Promise((resolve, reject) => {

            function inventoryCallback(response) {
                forceUpdateInventory(response, "skins");
                resolve();
            }

            function putCallback(response) {
                console.log("put")
                forceUpdateLoadout(response);
            }

            socket.request({ "request": "update_inventory", "args": { "payload": payload } }, inventoryCallback);
            if (!sameSkin) {
                socket.request({ "request": "put_weapon", "args": { "payload": payload } }, putCallback);
            }

        })

    }

    function closeEditor() {
        setWeaponEditorState(false);
        setWeaponEditor(null);
    }

    return (
        <div style={{ height: "100%", width: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1 }}>
            {inventory.skins !== {} ?
                <Container maxWidth={false} style={{ display: "flex", height: "auto", flexGrow: 1, }}>
                    {weaponEditor}
                    <Collection style={{ padding: "20px 0px 20px 0px" }} weaponEditorCallback={modificationMenu} loadout={loadout} setLoadout={null} skinsOwned={uniqueSkinsOwned} />
                </Container>
                : null}
        </div>
    )
}


export default CollectionHome