import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import Header from '../components/misc/Header.js'
import Footer from '../components/misc/Footer.js'
import WeaponEditor from '../components/weaponEditor/WeaponEditor.js'
import Collection from '../components/collection/Collection.js'

import NavBar from '../components/misc/Navigation.js'

import socket from "../services/Socket";

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

}));


function CollectionHome(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [loaded, setLoaded] = useState(false);
    const [selectedUuid, changeSelectedUuid] = useState("");
    const [inventoryData, updateInventoryData] = useState({});
    const [showWeaponEditor, setWeaponEditorState] = useState(false);
    const [loadout, setLoadout] = useState({});
    const [weaponEditor, setWeaponEditor] = useState();

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
        //setInterval(() => updateInventory(), 5000); //might consider making this a manual refresh
    }, []);

    useEffect(() => {
        if (!showWeaponEditor) {
            document.title = "VIM // Collection"
        }
    }, [showWeaponEditor])

    function load() {
        updateInventory();
        updateLoadout();

        //setInterval(() => updateLoadout(), 5000);
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
                setLoadout(response);
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
        <div style={{height: "100vh", width: "100vw", display: "flex", overflow: "auto"}}>
            <NavBar />
            <div style={{height: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1}}>
                <Header />
                <Container maxWidth={false} style={{ display: "flex", height: "auto", flexGrow: 1, }}>
                    {weaponEditor}
                    <Collection style={{padding: "20px 0px 20px 0px"}} weaponEditorCallback={modificationMenu} loadout={loadout} setLoadout={setLoadout} />
                </Container>
                <Footer />
            </div>
        </div>
    )
}


export default CollectionHome