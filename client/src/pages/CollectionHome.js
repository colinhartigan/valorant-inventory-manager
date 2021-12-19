import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import Header from '../components/misc/Header.js'
import WeaponEditor from '../components/weaponEditor/WeaponEditor.js'
import Collection from '../components/collection/Collection.js'

import { request, socket } from "../services/Socket"; 

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

    footer: {
        height: "25vh"
    },

    root: {
        height: "80vh",
        margin: "auto",
        display: "flex",
        padding: 0,
        flexGrow: 1,
    },
}));


function CollectionHome(props) {
    
    const classes = useStyles();

    const [loaded, setLoaded] = useState(false);
    const [selectedUuid, changeSelectedUuid] = useState("");
    const [inventoryData, updateInventoryData] = useState({});
    const [showWeaponEditor, setWeaponEditorState] = useState(false);
    const [loadout, setLoadout] = useState({});
    const [weaponEditor, setWeaponEditor] = useState();

    useEffect(() => {
        if(!loaded){
            load();
            setLoaded(true);
        }
        //setInterval(() => updateInventory(), 5000); //might consider making this a manual refresh
    }, []);

    useEffect(() => {
        if (!showWeaponEditor){
            document.title = "VSM // Collection"
        }
    }, [showWeaponEditor])

    function load(){
        setTimeout(() => {
            updateLoadout().then(() => {
                updateInventory()
            });
        },300)

        setInterval(() => updateLoadout(), 5000);
    }

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

    // socket.onmessage = (event) => {
    //     const response = JSON.parse(event.data);
    //     if (response.event === "loadout_updated"){
    //         setLoadout(response.data.loadout)
    //     }
    // }

    function modificationMenu(uuid){
        setWeaponEditorState(true);
        setWeaponEditor(<WeaponEditor weaponUuid={uuid} initialSkinData={loadout[uuid]} inventoryData={inventoryData} loadoutWeaponData={loadout[uuid]} saveCallback={saveCallback} closeEditor={closeEditor}/>)
    };

    async function saveCallback(payload,sameSkin){
        return new Promise((resolve,reject) => {
            try{
                // if favorites/weights were changed, always update
                request({"request":"update_inventory","args":{"payload": payload}})
                    .then(data => {
                        updateInventoryData(data.response);   
                        if(!sameSkin){
                            request({"request":"put_weapon","args":{"payload": payload}})
                                .then(data => {
                                    setLoadout(data.response);
                                    resolve();
                                });
                        }else{
                            resolve();
                        }
                    })
            }catch{
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
            <Header setLoadout={setLoadout}/>
            <Container maxWidth="xxl" className={classes.root}>
                {weaponEditor}
                <Collection weaponEditorCallback={modificationMenu} loadout={loadout}/>
            </Container>
        </>
    )
}


export default CollectionHome