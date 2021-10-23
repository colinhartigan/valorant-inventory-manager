import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grow, Backdrop, Paper, Grid, Typography, Divider, IconButton, Tooltip, CircularProgress } from '@material-ui/core';
import { Visibility, VisibilityOff, Close } from '@material-ui/icons'

import LevelSelector from './weaponEditorComponents/LevelSelector';
import ChromaSelector from './weaponEditorComponents/ChromaSelector';
import Weapon from './weaponEditorComponents/SkinGridItem';


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
        "&::-webkit-scrollbar": {
            width: 4,
        },
        "&::-webkit-scrollbar-track": {
            boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            outline: `1px solid slategrey`,
            backgroundClip: "padding-box",
        },
    },


    // stuff like skin name, weapon name, skin image
    paperOnTopContent: {
        width: "92%",
        background: "#424242",
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
        marginTop: "5px",
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

    skinSelector: {
        marginBottom: "15px",
        marginTop: "15px",
        padding: "2px 2px",
        display: "flex",
        justifyContent: "center",
    }

}));


function WeaponEditor(props) {

    const classes = useStyles();
    const theme = useTheme();

    const inventoryData = props.inventoryData[props.weaponUuid]
    const skinsData = inventoryData.skins
    const initSkinData = props.initialSkinData

    //skin data states
    const [equippedSkinData, setEquippedSkinData] = useState(skinsData[initSkinData.skin_uuid]);
    const [equippedLevelData, setEquippedLevelData] = useState(skinsData[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
    const [equippedChromaData, setEquippedChromaData] = useState(skinsData[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])

    //modal states
    const [open, changeOpenState] = useState(true);
    const [showingVideo, changeVideoState] = useState(false);
    const [hasAlternateMedia, changeAlternateMediaState] = useState(false);
    const [saving, setSaving] = useState(false);


    //effect listeners

    useEffect(() => {
        if (open) {
            document.title = `VSM // ${inventoryData.display_name}`
        }
    }, [open])

    useEffect(() => {
        updateAlternateMedia();
    }, [equippedSkinData, equippedLevelData, equippedChromaData])


    // functions

    function save() {
        //add a spinner on the x button
        setSaving(true);
        var data = {
            weaponUuid: props.weaponUuid,
            skinUuid: equippedSkinData["uuid"],
            levelUuid: equippedLevelData["uuid"],
            chromaUuid: equippedChromaData["uuid"],
        }
        var same = skinsData[initSkinData.skin_uuid] === equippedSkinData;
        console.log(inventoryData)
        console.log(equippedSkinData)
        console.log(same)
        var payload = JSON.stringify(data);
        props.saveCallback(payload, same).then(() => {
            changeOpenState(false);
            setTimeout(() => {
                props.closeEditor();
            },300)
        });
        
    }

    function updateAlternateMedia() {
        changeAlternateMediaState(equippedChromaData.video_preview !== null || equippedLevelData.video_preview !== null)
    }

    function getSkinMedia() {
        var showChroma = false;
        if (equippedChromaData.video_preview !== null) {
            showChroma = true;
        }
        if (!showingVideo) {
            return (
                <Grow in>
                    <img src={equippedChromaData.display_icon} style={{ width: "auto", height: "80%", objectFit: "contain", flexGrow: 1, marginLeft: (hasAlternateMedia ? "45px" : "0px"), alignSelf: "center", overflow: "hidden" }} />
                </Grow>
            )

        } else if (showingVideo && equippedLevelData.video_preview !== null) {
            return (
                <Grow in>
                    <video src={showChroma ? equippedChromaData.video_preview : equippedLevelData.video_preview} type="video/mp4" autoPlay onEnded={() => { changeVideoState(false) }} style={{ width: "auto", height: "100%", overflow: "hidden", objectFit: "contain", flexGrow: 1, marginLeft: "45px", alignSelf: "center" }} />
                </Grow>
            )
        } else {
            changeVideoState(false);
        }
    }

    function equipSkin(skinUuid) {
        var skinData = skinsData[skinUuid];
        var highestLevelIndex = 0;
        var highestChromaIndex = 0;

        for (var i = 0; i < Object.keys(skinData.levels).length; i++) {
            if (skinData.levels[Object.keys(skinData.levels)[i]].unlocked === true) {
                highestLevelIndex = skinData.levels[Object.keys(skinData.levels)[i]].index;
            }
        }
        for (var i = 0; i < Object.keys(skinData.chromas).length; i++) {
            if (skinData.chromas[Object.keys(skinData.chromas)[i]].unlocked === true) {
                highestChromaIndex = skinData.chromas[Object.keys(skinData.chromas)[i]].index;
            }
        }

        setEquippedSkinData(skinData);
        setEquippedLevelData(skinData.levels[Object.keys(skinData.levels)[highestLevelIndex - 1]]);
        setEquippedChromaData(skinData.chromas[Object.keys(skinData.chromas)[highestChromaIndex - 1]]);
        changeVideoState(false);
    }


    if (inventoryData == null && initSkinData == null) {

        return (
            null// TODO: THIS SHOULD RETURN SOME SORT OF ERROR
        )

    } else {

        // NEED TO ADD FAVORITE BUTTON (UPPER RIGHT CORNER OF MEDIA PREVIEW?)

        return (
            <Backdrop open={open} className={classes.backdrop} /*onClick={save}*/>
                <Grid container className={classes.masterGrid} direction="row" justifyContent="center" alignItems="center">
                    <Grid item xl={3} lg={5} md={6} sm={10} xs={12} style={{ display: "flex", marginTop: "10px" }}>
                        <Paper className={classes.mainPaper}>
                            <div className={classes.paperOnTopContent}>

                                <div className={classes.currentlyEquipped}>
                                    <div style={{ width: "auto", alignSelf: "center" }}>
                                        <img src={equippedSkinData.content_tier.display_icon} style={{ width: "auto", height: "40px", justifySelf: "center", marginRight: "10px" }} />
                                    </div>

                                    <div>
                                        <Typography variant="h5">
                                            {equippedSkinData.display_name}
                                        </Typography>
                                        <Typography variant="overline">
                                            {equippedSkinData.content_tier.dev_name !== "Battlepass" ? equippedSkinData.content_tier.dev_name : null} {inventoryData.display_name}
                                        </Typography>
                                    </div>

                                    <div style={{ flexGrow: 1, display: "flex", height: "100%", justifyContent: "flex-end" }}>
                                        <Tooltip title="Save and exit">
                                            {
                                                saving ? <CircularProgress color={theme.palette.secondary.dark} style={{ margin: "10px", height: "20px", width: "20px" }}/> :
                                                <IconButton onClick={save} style={{ height: "40px", width: "40px" }}>
                                                    <Close />
                                                </IconButton>
                                            }
                                            
                                        </Tooltip>
                                    </div>

                                </div>
                                <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                                    <Paper variant="outlined" outlinecolor="secondary" className={classes.mainSkinMedia} style={{ height: (showingVideo ? "250px" : "100px") }}>
                                        {getSkinMedia()}
                                        {
                                            hasAlternateMedia ?
                                                <Tooltip title="Toggle video preview">
                                                    <IconButton onClick={() => { changeVideoState(!showingVideo) }} aria-label="preview" style={{ height: "40px", width: "40px", alignSelf: "flex-end", position: "relative", right: "5px", bottom: "5px" }}>
                                                        {showingVideo ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </Tooltip>
                                                : null
                                        }
                                    </Paper>
                                </div>
                            </div>

                            <div className={classes.paperCustomizingContent}>

                                <div className={classes.levelSelectors}>
                                    <LevelSelector levelData={equippedSkinData.levels} equippedLevelIndex={equippedLevelData.index} equippedChromaIndex={equippedChromaData.index} setter={setEquippedLevelData} />
                                    <ChromaSelector chromaData={equippedSkinData.chromas} equippedChromaIndex={equippedChromaData.index} setter={setEquippedChromaData} />
                                </div>

                                <Divider variant="middle" />

                                <div className={classes.skinSelector}>
                                    <Grid style={{ width: "98%", height: "100%", justifySelf: "center" }} container justifyContent="left" direction="row" alignItems="center" spacing={1}>

                                        {Object.keys(skinsData).map(uuid => {
                                            var data = skinsData[uuid];
                                            return (
                                                <Grid item xs={4}>
                                                    <Weapon skinData={data} weaponData={inventoryData} equip={equipSkin} equipped={equippedSkinData} />
                                                </Grid>
                                            )
                                        })}

                                    </Grid>
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