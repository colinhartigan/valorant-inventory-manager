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
        marginTop: "20px",
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

    const [equippedSkinUuid, setEquippedSkinUuid] = useState("");
    const [currentPreviewImage, setCurrentPreviewImage] = useState("");
    const [equippedSkinData, setEquippedSkinData] = useState({});
    const [equippedLevelIndex, setEquippedLevelIndex] = useState("");


    if (props.show){

        var inventoryWeaponData = props.inventoryData[props.weaponUuid]
        var loadoutWeaponData = props.loadout[props.weaponUuid]
        console.log(loadoutWeaponData)

        if (loadoutWeaponData.skin_uuid != equippedSkinUuid){
            setEquippedSkinUuid(loadoutWeaponData.skin_uuid)
            setEquippedSkinData(inventoryWeaponData.skins[loadoutWeaponData.skin_uuid])
        }

        return (
            <Backdrop open={props.show} className={classes.backdrop} onClick={props.saveCallback}>
                <Grid container className={classes.masterGrid} direction="row" justifyContent="center" alignItems="center">
                    <Grid item xl={3} lg={5} md={6} sm={10} xs={12} style={{ display: "flex", marginTop: "10px" }}>
                        <Paper className={classes.mainPaper}>
                            <div className={classes.paperOnTopContent}>

                                <div className={classes.currentlyEquipped}>
                                    <div style={{ width: "auto", alignSelf: "center" }}>
                                        <img src={ loadoutWeaponData.skin_tier_image } style={{ width: "auto", height: "40px", justifySelf: "center", marginRight: "10px" }} />
                                    </div>

                                    <div>
                                        <Typography variant="h5">
                                            { loadoutWeaponData.skin_name }
                                        </Typography>
                                        <Typography variant="overline">
                                            { loadoutWeaponData.weapon_name }
                                        </Typography>
                                    </div>

                                </div>
                                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                                    <Paper variant="outlined" outlinecolor="secondary" className={classes.mainSkinImage}>
                                        <img src={ loadoutWeaponData.skin_image } style={{ width: "auto", height: "100%" }} />
                                    </Paper>
                                </div>

                            </div>


                            <div className={classes.paperCustomizingContent}>

                                <div className={classes.levelSelectors}>
                                    <LevelSelector levelData={ equippedSkinData.levels } equippedLevelUuid={ loadoutWeaponData.level_uuid }/>
                                    <ChromaSelector />
                                </div>

                                <div className={classes.skinGrid}> 
                                    
                                </div>
                                

                            </div>


                        </Paper>
                    </Grid>
                </Grid>
            </Backdrop>
        )
    }else{
        return null
    }
}

export default WeaponEditor