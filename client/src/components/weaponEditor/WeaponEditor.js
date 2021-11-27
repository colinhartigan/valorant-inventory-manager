import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grow, Backdrop, Paper, Grid, Typography, Divider, IconButton, Tooltip, CircularProgress } from '@material-ui/core';
import { Visibility, VisibilityOff, Palette, Loyalty, LoyaltyOutlined, PaletteOutlined, PlayArrowOutlined, StopOutlined } from '@material-ui/icons'
import { Rating } from '@material-ui/lab';

import LevelSelector from './LevelSelector.js';
import ChromaSelector from './ChromaSelector.js';
import Weapon from './SkinGridItem.js';
import Header from './WeaponHeader.js';


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
        height: "90vh",
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
    },

    equippedActions: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
        marginLeft: "10px", 
        padding: "2px",
    },

    previewAction: {
        height: "35px",
        width: "35px",
        alignSelf: "center",
        margin: theme.spacing(.25)
    },

    previewActionIcon: {
        width: "20px",
        height: "20px",
    },

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

    //favorites states
    const [isFavoriteSkin, setIsFavoriteSkin] = useState(skinsData[initSkinData.skin_uuid].favorite)
    const [favoriteLevels, setFavoriteLevels] = useState();
    const [favoriteChromas, setFavoriteChromas] = useState();

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
        setSaving(true);
        var data = {
            weaponUuid: props.weaponUuid,
            skinUuid: equippedSkinData["uuid"],
            levelUuid: equippedLevelData["uuid"],
            chromaUuid: equippedChromaData["uuid"],
        }
        var oldSkinId = initSkinData.skin_uuid
        var oldChromaId = initSkinData.chroma_uuid
        var oldLevelId = initSkinData.level_uuid
        var same = equippedLevelData["uuid"] === oldLevelId && equippedChromaData["uuid"] === oldChromaId && equippedSkinData["uuid"] === oldSkinId;
        var payload = JSON.stringify(data);
        var success = false;
        props.saveCallback(payload, same)
            .then(() => {
                success = true;
                changeOpenState(false);
                setTimeout(() => {
                    props.closeEditor();
                }, 300)
            });
        setTimeout(() => {
            if (!success) {
                changeOpenState(false);
                setTimeout(() => {
                    props.closeEditor();
                }, 300)
            }
        }, 3000);

    }

    function updateFavorited(newValue) {
        setIsFavoriteSkin(newValue ? true : false)
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
                    <img alt={equippedChromaData.display_name} src={equippedChromaData.display_icon} style={{ maxWidth: "90%", maxHeight: "80%", objectFit: "contain", alignSelf: "center", overflow: "hidden" }} />
                </Grow>
            )

        } else if (showingVideo && equippedLevelData.video_preview !== null) {
            return (
                <Grow in>
                    <video src={showChroma ? equippedChromaData.video_preview : equippedLevelData.video_preview} type="video/mp4" autoPlay onEnded={() => { changeVideoState(false) }} style={{ width: "auto", height: "100%", overflow: "hidden", objectFit: "contain", flexGrow: 1, alignSelf: "center" }} />
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

        return (
            <Backdrop open={open} className={classes.backdrop} /*onClick={save}*/>
                <Grid container className={classes.masterGrid} direction="row" justifyContent="center" alignItems="center">
                    <Grid item xl={3} lg={5} md={6} sm={10} xs={12} style={{ display: "flex", marginTop: "10px" }}>
                        <Paper className={classes.mainPaper}>
                            <div className={classes.paperOnTopContent}>

                                <Header equippedSkinData={equippedSkinData} inventoryData={inventoryData} saving={saving} saveCallback={save} />

                                <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>

                                    <Paper variant="outlined" outlinecolor="secondary" className={classes.mainSkinMedia} style={{ height: (showingVideo ? "250px" : "125px") }}>
                                        {getSkinMedia()}
                                    </Paper>

                                    <Paper variant="outlined" outlinecolor="secondary" className={classes.equippedActions}>
                                        
                                        <Tooltip title="Add level to favorites">
                                            <IconButton aria-label="preview" className={classes.previewAction}>
                                                <LoyaltyOutlined className={classes.previewActionIcon} />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Add chroma to favorites">
                                            <IconButton aria-label="preview" className={classes.previewAction}>
                                                <PaletteOutlined className={classes.previewActionIcon} />
                                            </IconButton>
                                        </Tooltip>

                                        {
                                            hasAlternateMedia ?
                                                <Tooltip title="Toggle video preview">
                                                    <IconButton onClick={() => { changeVideoState(!showingVideo) }} aria-label="preview" className={classes.previewAction}>
                                                        {showingVideo ? <StopOutlined className={classes.previewActionIcon} /> : <PlayArrowOutlined className={classes.previewActionIcon} />}
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
                                    <Grid style={{ width: "100%", height: "100%", justifySelf: "center" }} container justifyContent="left" direction="row" alignItems="center" spacing={1}>

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