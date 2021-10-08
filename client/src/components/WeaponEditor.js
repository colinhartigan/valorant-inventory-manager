import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Backdrop, Paper, Grid, Typography, Container, IconButton, Slide, AppBar } from '@material-ui/core';

import LevelSelector from './weaponEditorComponents/LevelSelector';
import ChromaSelector from './weaponEditorComponents/ChromaSelector'


const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: 3,
    },

    masterGrid: {
        display: "flex",
        margin: "auto",
        height: "100%",
        width: "100%",
    },

    mainPaper: {
        margin: "auto",
        width: "100%",
        height: "80vh",
        //height: "90vh",
        display: "flex",
        justifySelf: "flex-start",
        justifyContent: "center",
        alignContent: "flex-start",
        flexWrap: "wrap",
        overflow: "auto",
    },


    // stuff like skin name, weapon name, skin image
    paperOnTopContent: {
        width: "90%",
        display: "flex",
        flexDirection: "column",
    },

    mainSkinImage: {
        width: "auto",
        height: "100px",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        paddingTop: "10px",
        paddingBottom: "10px",
        marginTop: "10px",
    },

    currentlyEquipped: {
        width: "auto",
        display: "flex",
        marginTop: "15px",
        flexWrap: "wrap",
    },


    //container for subcomponents
    paperCustomizingContent: {
        width: "90%",
        height: "auto",
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
    },

    levelSelectors: {
        height: "45px",
        display: "flex",
        flexDirection: "row",
        width: "100%"
    }

}));


function WeaponEditor(props) {

    const classes = useStyles();
    const inventoryData = props.inventoryData[props.weaponUuid] 
    const initSkinData = props.initialSkinData
    console.log(inventoryData) 

    const [open, changeOpenState] = useState(true);

    const [equippedSkinUuid, setEquippedSkinUuid] = useState(initSkinData.uuid);
    const [equippedSkinData, setEquippedSkinData] = useState(inventoryData.skins[initSkinData.skin_uuid]);
    const [equippedLevelData, setEquippedLevelData] = useState(inventoryData.skins[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
    const [equippedChromaData, setEquippedChromaData] = useState(inventoryData.skins[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])

    function save(){
        changeOpenState(false);
        props.saveCallback();
    }

    if(inventoryData == null && initSkinData == null){

        return (
            null// THIS SHOULD RETURN SOME SORT OF ERROR
        )

    }else{

        return (
            <Backdrop open={open} className={classes.backdrop} /*onClick={save}*/>
                <Grid container className={classes.masterGrid} direction="row" justifyContent="center" alignItems="center">
                    <Grid item xl={3} lg={5} md={6} sm={10} xs={12} style={{ display: "flex", marginTop: "10px" }}>
                        <Paper className={classes.mainPaper}>
                            <div className={classes.paperOnTopContent}>

                                <div className={classes.currentlyEquipped}>
                                    <div style={{ width: "auto", alignSelf: "center" }}>
                                        <img src={ equippedSkinData.content_tier.displayIcon } style={{ width: "auto", height: "40px", justifySelf: "center", marginRight: "10px" }} />
                                    </div>

                                    <div>
                                        <Typography variant="h5">
                                            { equippedSkinData.display_name }
                                        </Typography>
                                        <Typography variant="overline">
                                            { inventoryData.display_name }
                                        </Typography>
                                    </div>

                                </div>
                                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                                    <Paper variant="outlined" outlinecolor="secondary" className={classes.mainSkinImage}>
                                        <img src={ equippedChromaData.display_icon } style={{ width: "auto", height: "100%" }} />
                                    </Paper>
                                </div>

                            </div>


                            <div className={classes.paperCustomizingContent}>

                                <div className={classes.levelSelectors}>
                                    <LevelSelector levelData={ equippedSkinData.levels } equippedLevelIndex={ equippedLevelData.index }/>
                                    <ChromaSelector chromaData={ equippedSkinData.chromas } equippedChromaUuid={ equippedChromaData.uuid }/>
                                </div>

                                <div className={classes.skinGrid}> 
                                    
                                </div>
                                

                            </div>


                        </Paper>
                    </Grid>
                </Grid>
            </Backdrop>
        )
    }
}

export default WeaponEditor