import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Grow, Backdrop, Paper, Grid, Typography, Divider, IconButton, Tooltip, AppBar } from '@material-ui/core';
import { Visibility, VisibilityOff, Close } from '@material-ui/icons'

import LevelSelector from './weaponEditorComponents/LevelSelector';
import ChromaSelector from './weaponEditorComponents/ChromaSelector';
import Weapon from './weaponEditorComponents/WeaponGridItem';


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
        width: "92%",
        paddingBottom: "10px",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        zIndex: 4,
    },

    mainSkinMedia: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        marginTop: "10px",
        transition: "all .2s ease",
    },

    currentlyEquipped: {
        width: "auto",
        display: "flex",
        marginTop: "15px",
        flexWrap: "wrap",
    },


    //container for subcomponents
    paperCustomizingContent: {
        width: "92%",
        height: "auto",
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        alignItems: "stretch",
        top: 0,
    },

    levelSelectors: {
        height: "45px",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        marginBottom: "15px"
    },

    skinGridPaper: {
        minHeight: "200px",
        marginTop: "20px",
        marginBottom: "15px",
        padding: "5px 5px",
        display: "flex",
        justifyContent: "center",
        flexGrow: 2
    }

}));


function WeaponEditor(props) {

    const classes = useStyles();
    const inventoryData = props.inventoryData[props.weaponUuid] 
    const skinsData = inventoryData.skins
    const initSkinData = props.initialSkinData
    console.log(inventoryData)  

    //skin data states
    const [equippedSkinData, setEquippedSkinData] = useState(inventoryData.skins[initSkinData.skin_uuid]);
    const [equippedLevelData, setEquippedLevelData] = useState(inventoryData.skins[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
    const [equippedChromaData, setEquippedChromaData] = useState(inventoryData.skins[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])

    //modal states
    const [open, changeOpenState] = useState(true);
    const [showingVideo, changeVideoState] = useState(false);
    const [hasAlternateMedia, changeAlternateMediaState] = useState(false);

    function save(){
        changeOpenState(false);
        setTimeout(() => {
            props.saveCallback();
        }, 300);
        
    }

    function updateAlternateMedia(){
        changeAlternateMediaState(equippedChromaData.video_preview !== null || equippedLevelData.video_preview !== null)
    }

    useEffect(() => {
        updateAlternateMedia();
    }, [equippedSkinData, equippedLevelData, equippedChromaData])

    function getSkinMedia(){
        var showChroma = false;
        if (equippedChromaData.video_preview !== null){
            showChroma = true;
        }
        if(!showingVideo){
            return ( 
                <Grow in>
                    <img src={ equippedChromaData.display_icon } style={{ width: "auto", height: "80%", objectFit: "contain", flexGrow: 1, marginLeft: (hasAlternateMedia ? "45px" : "0px"), alignSelf: "center", overflow: "hidden" }} />
                </Grow>
            )
            
        }else if (showingVideo && equippedLevelData.video_preview !== null){
            return(
                <Grow in>
                    <video src={showChroma ? equippedChromaData.video_preview : equippedLevelData.video_preview} type="video/mp4" autoPlay loop style={{ width: "auto", height: "100%", overflow: "hidden", objectFit: "contain", flexGrow: 1, marginLeft: "45px", alignSelf: "center" }} />
                </Grow>
            )
        }else{
            changeVideoState(false);
        }
    }

    if(inventoryData == null && initSkinData == null){

        return (
            null// TODO: THIS SHOULD RETURN SOME SORT OF ERROR
        )

    }else{

        // NEED TO ADD FAVORITE BUTTON (UPPER RIGHT CORNER OF MEDIA PREVIEW?)

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

                                    <div style={{flexGrow: 1, display: "flex", height: "100%", justifyContent: "flex-end"}}>
                                        <Tooltip title="Exit">
                                            <IconButton onClick={save} style={{ height: "40px", width: "40px", justifySelf: "flex-end" }}>
                                                <Close/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
 
                                </div>
                                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                                    <Paper variant="outlined" outlinecolor="secondary" className={classes.mainSkinMedia} style={{ height: (showingVideo ? "250px" : "100px")}}>
                                        {getSkinMedia()}        
                                        {
                                            hasAlternateMedia ?
                                                <Tooltip title="Toggle video preview">
                                                    <IconButton onClick={()=>{changeVideoState(!showingVideo)}}aria-label="preview" style={{ height: "40px", width: "40px", alignSelf: "flex-end", position: "relative", right: "5px", bottom: "5px" }}>
                                                        {showingVideo ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </Tooltip>
                                            : null
                                        }     
                                                              
                                    </Paper>
                                </div>

                            </div> 


                            <div className={classes.paperCustomizingContent}>

                                <div className={classes.levelSelectors}>
                                    <LevelSelector levelData={ equippedSkinData.levels } equippedLevelIndex={ equippedLevelData.index } setter={setEquippedLevelData}/>
                                    <ChromaSelector chromaData={ equippedSkinData.chromas } equippedChromaIndex={ equippedChromaData.index } setter={setEquippedChromaData}/>
                                </div>
                                
                                <Divider variant="middle"/>
                                
                                <Paper variant="outlined" className={classes.skinGridPaper}>
                                    <Grid style={{ width: "98%", height: "100%", justifySelf: "center" }} container justifyContent="left" direction="row" alignItems="center" spacing={1}>

                                        {Object.keys(skinsData).map(uuid => {
                                            var data = skinsData[uuid];
                                            return (
                                                <Grid item xs={3}>
                                                    <Weapon skinData={data}/>
                                                </Grid>
                                            )
                                        })}

                                    </Grid>
                                </Paper>
                                

                            </div>


                        </Paper>
                    </Grid>
                </Grid>
            </Backdrop>
        )
    }
}

export default WeaponEditor