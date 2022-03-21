import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import Header from '../components/misc/Header.js'
import Footer from '../components/misc/Footer.js'
import WeaponEditor from '../components/weaponEditor/WeaponEditor.js'
import Collection from '../components/collection/Collection.js'

import socket from "../services/Socket";

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

}));


function CollectionHome(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [loaded, setLoaded] = useState(false);
    const [inventoryData, updateInventoryData] = useState({});
    const [showWeaponEditor, setWeaponEditorState] = useState(false);
    const [loadout, setLoadout] = useState({});
    const [weaponEditor, setWeaponEditor] = useState();
    const [uniqueSkinsOwned, setUniqueSkinsOwned] = useState(0);

    useEffect(() => {
        if (!loaded) {
            load();
            setLoaded(true);
        }

        function updatedLoadoutCallback(response) {
            console.log(response);
            setLoadout(response.loadout)
        }
        socket.subscribe("loadout_updated", updatedLoadoutCallback)
    }, []);

    useEffect(() => {
        if (!showWeaponEditor) {
            document.title = "VIM // Collection"
        }
    }, [showWeaponEditor])

    useEffect(() => {
        // count how many skins are owned for skin changer warning dialog
        var skinsOwned = 0;

        for (var weapon in inventoryData) {
            skinsOwned += Object.keys(inventoryData[weapon].skins).length - 1;
        }
        setUniqueSkinsOwned(skinsOwned);
    }, [inventoryData])

    function load() {
        updateInventory();
        updateLoadout();
    }

    function updateInventory() {
        function callback(response) {
            updateInventoryData(response.skins);
        }
        socket.request({ "request": "fetch_inventory" }, callback)
    }

    function updateLoadout() {
        function callback(response) {
            setLoadout(response.loadout);
        }
        socket.request({ "request": "fetch_loadout" }, callback)
    }

    function modificationMenu(uuid) {
        setWeaponEditorState(true);
        setWeaponEditor(<WeaponEditor weaponUuid={uuid} initialSkinData={loadout[uuid]} inventoryData={inventoryData} loadoutWeaponData={loadout[uuid]} saveCallback={saveCallback} closeEditor={closeEditor} />)
    };

    async function saveCallback(payload, sameSkin) {
        return new Promise((resolve, reject) => {

            function inventoryCallback(response) {
                updateInventoryData(response);
                resolve();
            }

            function putCallback(response) {
                console.log("put")
                setLoadout(response.loadout);
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
        <div style={{ height: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1 }}>
            <Header />
            {inventoryData !== {} ?
                <Container maxWidth={false} style={{ display: "flex", height: "auto", flexGrow: 1, }}>
                    {weaponEditor}
                    <Collection style={{ padding: "20px 0px 20px 0px" }} weaponEditorCallback={modificationMenu} loadout={loadout} setLoadout={setLoadout} skinsOwned={uniqueSkinsOwned} />
                </Container>
                : null}
            <Footer />
        </div>
    )
}


export default CollectionHome