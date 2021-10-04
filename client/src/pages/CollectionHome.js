import { React, useEffect, useState } from 'react';
import Loader from "react-loader-spinner";

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import Header from '../components/Header.js'
import WeaponEditor from '../components/WeaponEditor.js'
import Collection from '../components/Collection.js'

import { request } from "../services/Socket"; 

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

    footer: {
        height: "25vh"
    },

    root: {
        margin: "auto",
        display: "flex",
        padding: 0,
    },
}));


function CollectionHome(props) {
    
    const classes = useStyles();

    const [selectedUuid, changeSelectedUuid] = useState("");
    const [inventoryData, updateInventoryData] = useState({});
    const [showWeaponEditor, toggleWeaponEditor] = useState(false);
    const [loadout, setLoadout] = useState({});

    useEffect(() => {
        document.title = "valorant-skin-manager / home"
        updateInventory();
        setTimeout(() => updateLoadout(), 1000);

        setInterval(() => updateLoadout(), 5000);
        //setInterval(() => updateInventory(), 5000); //might consider making this a manual refresh
    }, []);

    function updateInventory() {
        request({"request":"fetch_inventory"})
            .then(data => {
                console.log(data);
                if (data.success === true && data.request === "fetch_inventory") {
                    console.log("ok")
                    updateInventoryData(data.response.skins);
                }
            });
    }

    function updateLoadout() {
        request({"request":"fetch_loadout"})
            .then(data => {
                if (data.success === true && data.request === "fetch_loadout") {
                    setLoadout(data.response);
                }
            });
    }

    function modificationMenu(uuid){
        console.log("yes");
        changeSelectedUuid(uuid);
        toggleWeaponEditor(true);
    };

    function saveCallback(){
        toggleWeaponEditor(false);
    }

    return (
        <>
            <Header />
            <Container maxWidth="xl" className={classes.root}>
                <WeaponEditor weaponUuid={selectedUuid} inventoryData={inventoryData} loadout={loadout} show={showWeaponEditor} saveCallback={saveCallback}/>
                <Collection weaponEditorCallback={modificationMenu} loadout={loadout}/>
            </Container>
        </>
    )
}


export default CollectionHome