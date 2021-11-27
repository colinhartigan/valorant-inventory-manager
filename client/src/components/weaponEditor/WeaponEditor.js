import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grow, Backdrop, Paper, Grid, Typography, Divider, IconButton, Tooltip, CircularProgress } from '@material-ui/core';

import LevelSelector from './LevelSelector.js';
import ChromaSelector from './ChromaSelector.js';
import Weapon from './SkinGridItem.js';
import WeaponHeader from './WeaponHeader.js';
import ActionsDrawer from './ActionsDrawer.js';


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

    const [canFavoriteLevels, setCanFavoriteLevels] = useState(true)
    const [canFavoriteChromas, setCanFavoriteChromas] = useState(true)

    const [isFavoriteLevel, setIsFavoriteLevel] = useState(false);
    const [isFavoriteChroma, setIsFavoriteChroma] = useState(false);

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

    // things that should update whenever skin, level, or chroma changes
    useEffect(() => {
        updateAlternateMedia();
        getFavorited();
        getFavoritedLevels();
        getFavoritedChromas();
    }, [equippedSkinData, equippedLevelData, equippedChromaData])



    // functions
    function save() {
        //update if there were changes to favorites and stuff
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

    function equipSkin(skinUuid) {
        var skinData = skinsData[skinUuid];
        var highestLevelIndex = 0;
        var highestChromaIndex = 0;

        for (var i = 0; i < Object.keys(skinData.levels).length; i++) {
            if (skinData.levels[Object.keys(skinData.levels)[i]].unlocked === true) {
                highestLevelIndex = skinData.levels[Object.keys(skinData.levels)[i]].index;
            }
        }
        for (var j = 0; j < Object.keys(skinData.chromas).length; j++) {
            if (skinData.chromas[Object.keys(skinData.chromas)[j]].unlocked === true) {
                highestChromaIndex = skinData.chromas[Object.keys(skinData.chromas)[j]].index;
            }
        }

        setEquippedSkinData(skinData);
        setEquippedLevelData(skinData.levels[Object.keys(skinData.levels)[highestLevelIndex - 1]]);
        setEquippedChromaData(skinData.chromas[Object.keys(skinData.chromas)[highestChromaIndex - 1]]);
        changeVideoState(false);
    }


    //favorites system
    function toggleFavoritedSkin() {
        skinsData[equippedSkinData.uuid].favorite = !isFavoriteSkin;
        setIsFavoriteSkin(!isFavoriteSkin);
    }

    function toggleFavoritedLevel(){
        var levelUuid = equippedLevelData.uuid;
        var currentlyFavoritedLevels = favoriteLevels;
        var newState = !currentlyFavoritedLevels.includes(equippedLevelData.uuid)

        if (newState && !currentlyFavoritedLevels.includes(levelUuid)) {
            currentlyFavoritedLevels.push(levelUuid);
        } else if (!newState && currentlyFavoritedLevels.includes(levelUuid)) {
            currentlyFavoritedLevels.splice(currentlyFavoritedLevels.indexOf(levelUuid), 1);
        }

        setIsFavoriteLevel(newState);
        setFavoriteLevels(currentlyFavoritedLevels);
        skinsData[equippedSkinData.uuid].levels[equippedLevelData.uuid].favorite = newState;
    }

    function toggleFavoritedChroma(){
        var chromaUuid = equippedChromaData.uuid;
        var currentlyFavoritedChromas = favoriteChromas;
        var newState = !currentlyFavoritedChromas.includes(equippedChromaData.uuid)

        if (newState && !currentlyFavoritedChromas.includes(chromaUuid)) {
            currentlyFavoritedChromas.push(chromaUuid);
        } else if (!newState && currentlyFavoritedChromas.includes(chromaUuid)) {
            currentlyFavoritedChromas.splice(currentlyFavoritedChromas.indexOf(chromaUuid), 1);
        }

        setIsFavoriteChroma(newState);
        setFavoriteChromas(currentlyFavoritedChromas);
        skinsData[equippedSkinData.uuid].chromas[equippedChromaData.uuid].favorite = newState;
    }


    //getters
    function getFavorited(){
        setIsFavoriteSkin(equippedSkinData.favorite);
    }

    function getFavoritedLevels(){
        var levels = equippedSkinData.levels;
        var favLevels = [];
        for(const level_uuid of Object.keys(levels)) {
            var level = levels[level_uuid];
            if(level.favorite){
                favLevels.push(level.uuid);
            }
        }
        setFavoriteLevels(favLevels);

        if (favLevels.includes(equippedLevelData.uuid)) {
            setIsFavoriteLevel(true);
        } else {
            setIsFavoriteLevel(false);
        }

        if (Object.keys(levels).length === 1){
            setCanFavoriteLevels(false);
        } else {
            setCanFavoriteLevels(true);
        }
    }

    function getFavoritedChromas(){
        var chromas = equippedSkinData.chromas;
        var favChromas = [];
        for(const chroma_uuid of Object.keys(chromas)) {
            var chroma = chromas[chroma_uuid];
            if(chroma.favorite){
                favChromas.push(chroma.uuid);
            }
        }
        setFavoriteChromas(favChromas)

        if (favChromas.includes(equippedChromaData.uuid)) {
            setIsFavoriteChroma(true);
        } else {
            setIsFavoriteChroma(false);
        }

        if (Object.keys(chromas).length === 1){
            setCanFavoriteChromas(false);
        } else {
            setCanFavoriteChromas(true);
        }
    }

    //skin media stuff
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
                    <img alt={equippedChromaData.display_name} src={equippedChromaData.display_icon} style={{ maxWidth: "90%", maxHeight: "85%", objectFit: "contain", alignSelf: "center", overflow: "hidden" }} />
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

                                <WeaponHeader equippedSkinData={equippedSkinData} inventoryData={inventoryData} saving={saving} saveCallback={save} isFavorite={isFavoriteSkin} favoriteCallback={toggleFavoritedSkin}/>

                                <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>

                                    <Paper variant="outlined" outlinecolor="secondary" className={classes.mainSkinMedia} style={{ height: (showingVideo ? "250px" : "125px") }}>
                                        {getSkinMedia()}
                                    </Paper>

                                    <ActionsDrawer hasAlternateMedia={hasAlternateMedia} showingVideo={showingVideo} changeVideoStateCallback={changeVideoState} toggleFavoriteLevelCallback={toggleFavoritedLevel} isFavoriteLevel={isFavoriteLevel} toggleFavoriteChromaCallback={toggleFavoritedChroma} isFavoriteChroma={isFavoriteChroma} canFavoriteLevels={canFavoriteLevels} canFavoriteChromas={canFavoriteChromas}/>

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