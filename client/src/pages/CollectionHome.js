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
    const [showWeaponEditor, setWeaponEditorState] = useState(false);
    const [loadout, setLoadout] = useState({});
    const [weaponEditor, setWeaponEditor] = useState();

    useEffect(() => {
        updateLoadout().then(() => {
            updateInventory();
        });
        

        setInterval(() => updateLoadout(), 5000);
        //setInterval(() => updateInventory(), 5000); //might consider making this a manual refresh
    }, []);

    useEffect(() => {
        if (!showWeaponEditor){
            document.title = "VSM // Collection"
        }
    }, [showWeaponEditor])


    //obligatory "i hate async" comment
    async function updateInventory() {
        await request({"request":"fetch_inventory"})
            .then(data => {
                if (data.success === true) {
                    updateInventoryData(data.response.skins);
                }
            });
    }

    async function updateLoadout() {
        await request({"request":"fetch_loadout"})
            .then(data => {
                if (data.success === true) {
                    setLoadout(data.response);
                }
            });
    }

    function modificationMenu(uuid){
        setWeaponEditorState(true);
        setWeaponEditor(<WeaponEditor weaponUuid={uuid} initialSkinData={loadout[uuid]} inventoryData={inventoryData} loadoutWeaponData={loadout[uuid]} saveCallback={saveCallback} closeEditor={closeEditor}/>)
    };

    async function saveCallback(payload,same){
        return new Promise((resolve,reject) => {
            if(!same){
                request({"request":"put_weapon","args":{"payload": payload}})
                .then(data => {
                    setLoadout(data.response);
                    resolve();
                });
            }else{
                resolve();
            }
        })
    }
    
    function closeEditor(){
        setWeaponEditorState(false);
        setWeaponEditor(null);
    }

    return (
        <>
            <Header />
            <Container maxWidth="xl" className={classes.root}>
                {weaponEditor}
                <Collection weaponEditorCallback={modificationMenu} loadout={loadout}/>
            </Container>
        </>
    )
}


export default CollectionHome