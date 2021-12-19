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
import WeightDialog from './WeightDialog.js'


const useStyles = makeStyles((theme) => ({

    backdrop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    masterGrid: {
        display: "flex",
        margin: "auto",
        height: "100%",
        width: "100%",
    },

    mainPaper: {
        margin: "auto",
        width: "50%",
        height: "90vh",
        minWidth: "500px",
        maxWidth: "800px",

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
        display: "flex",
        flexDirection: "row",
        width: "100%",
        flexGrow: 1,
        marginBottom: "15px",
        transition: "all .2s ease",
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

    const inventoryWeaponData = props.inventoryData[props.weaponUuid]
    const skinsData = inventoryWeaponData.skins
    const initSkinData = props.initialSkinData

    //skin data states
    const [equippedSkinData, setEquippedSkinData] = useState(skinsData[initSkinData.skin_uuid]);
    const [equippedLevelData, setEquippedLevelData] = useState(skinsData[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
    const [equippedChromaData, setEquippedChromaData] = useState(skinsData[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])

    //favorites states
    const [isFavoriteSkin, setIsFavoriteSkin] = useState(skinsData[initSkinData.skin_uuid].favorite)
    const [favoriteLevels, setFavoriteLevels] = useState();
    const [favoriteChromas, setFavoriteChromas] = useState();

    const [canFavoriteLevel, setCanFavoriteLevel] = useState(true)
    const [canFavoriteChroma, setCanFavoriteChroma] = useState(true)

    const [isFavoriteLevel, setIsFavoriteLevel] = useState(false);
    const [isFavoriteChroma, setIsFavoriteChroma] = useState(false);

    //locked states
    const [isLocked, setIsLocked] = useState(inventoryWeaponData.locked);

    //modal states
    const [open, changeOpenState] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasUpgrades, setHasUpgrades] = useState(false);

    //video states
    const [showingVideo, changeVideoState] = useState(false);
    const [hasAlternateMedia, changeAlternateMediaState] = useState(false);
    const [showingControls, changeControlsState] = useState(false);

    //weight modal states
    const [weightDialogOpen, setWeightDialogOpen] = useState(false);


    //effect listeners
    useEffect(() => {
        if (open) {
            document.title = `VSM // ${inventoryWeaponData.display_name}`
        }
    }, [open])

    // things that should update whenever skin, level, or chroma changes
    useEffect(() => {
        refresh();
    }, [equippedSkinData, equippedLevelData, equippedChromaData])

    // on initial open, update level/chroma selectors
    useEffect(() => {
        equipSkin(initSkinData.skin_uuid);
        setEquippedLevelData(skinsData[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
        setEquippedChromaData(skinsData[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])
    }, [])


    // functions
    function refresh() {
        updateAlternateMedia();
        refreshFavorited();
        refreshFavoritedLevels();
        refreshFavoritedChromas();
    }

    function save() {
        //update if there were changes to favorites and stuff
        setSaving(true);
        var data = {
            weaponUuid: props.weaponUuid,
            skinUuid: equippedSkinData["uuid"],
            levelUuid: equippedLevelData["uuid"],
            chromaUuid: equippedChromaData["uuid"],
            inventoryData: inventoryWeaponData,
            skinsData: skinsData,
        }
        var oldSkinId = initSkinData.skin_uuid
        var oldChromaId = initSkinData.chroma_uuid
        var oldLevelId = initSkinData.level_uuid
        var sameSkin = equippedLevelData["uuid"] === oldLevelId && equippedChromaData["uuid"] === oldChromaId && equippedSkinData["uuid"] === oldSkinId;

        var payload = JSON.stringify(data);
        var success = false;
        props.saveCallback(payload, sameSkin)
            .then(() => {
                success = true;
                changeOpenState(false);
                setTimeout(() => {
                    props.closeEditor();
                }, 100)
            });
        setTimeout(() => {
            if (!success) {
                changeOpenState(false);
                setTimeout(() => {
                    props.closeEditor();
                }, 100)
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

        if (Object.keys(skinData.levels).length === 1 && Object.keys(skinData.chromas).length === 1) {
            setHasUpgrades(false);
        } else {
            setHasUpgrades(true);
        }

        setEquippedSkinData(skinData);
        setEquippedLevelData(skinData.levels[Object.keys(skinData.levels)[highestLevelIndex - 1]]);
        setEquippedChromaData(skinData.chromas[Object.keys(skinData.chromas)[0]]);
        changeVideoState(false);
        changeControlsState(false);
    }

    // lock a weapon's skin so it can't be changed by randomizer
    function toggleLock() {
        setIsLocked(!inventoryWeaponData.locked);
        inventoryWeaponData.locked = !inventoryWeaponData.locked;
    }

    //favorites system
    //if a chroma is favorited, level 4 must also be favorited
    //if a level is favorited, chroma 1 must also be favorited
    function toggleFavoritedSkin() {
        skinsData[equippedSkinData.uuid].favorite = !isFavoriteSkin;
        if(!isFavoriteSkin) {
            inventoryWeaponData.total_weights += equippedSkinData.weight;
        } else {
            inventoryWeaponData.total_weights -= equippedSkinData.weight;
        }
        setIsFavoriteSkin(!isFavoriteSkin);
    }

    function toggleFavoritedLevel(levelUuidOverride = null, stateOverride = null) {

        var levelUuid
        if (levelUuidOverride === null) {
            levelUuid = equippedLevelData.uuid;
        } else {
            levelUuid = levelUuidOverride;
        }

        var currentlyFavoritedLevels = favoriteLevels;

        var newState
        if (stateOverride === null) {
            newState = !currentlyFavoritedLevels.includes(equippedLevelData.uuid)
        } else {
            newState = stateOverride;
        }

        if (newState && !currentlyFavoritedLevels.includes(levelUuid)) {
            currentlyFavoritedLevels.push(levelUuid);
        } else if (!newState && currentlyFavoritedLevels.includes(levelUuid)) {
            currentlyFavoritedLevels.splice(currentlyFavoritedLevels.indexOf(levelUuid), 1);
        }

        setIsFavoriteLevel(newState);
        setFavoriteLevels(currentlyFavoritedLevels);
        skinsData[equippedSkinData.uuid].levels[equippedLevelData.uuid].favorite = newState;
    }

    function toggleFavoritedChroma(chromaUuidOverride = null, stateOverride = null) {
        var chromaUuid
        if (chromaUuidOverride === null) {
            chromaUuid = equippedChromaData.uuid;
            console.log(chromaUuid)
        } else {
            chromaUuid = chromaUuidOverride;
        }

        var currentlyFavoritedChromas = favoriteChromas;

        var newState
        if (stateOverride === null) {
            newState = !currentlyFavoritedChromas.includes(equippedChromaData.uuid)
        } else {
            newState = stateOverride
        }

        if (newState && !currentlyFavoritedChromas.includes(chromaUuid)) {
            currentlyFavoritedChromas.push(chromaUuid);
        } else if (!newState && currentlyFavoritedChromas.includes(chromaUuid)) {
            currentlyFavoritedChromas.splice(currentlyFavoritedChromas.indexOf(chromaUuid), 1);
        }

        setIsFavoriteChroma(newState);
        setFavoriteChromas(currentlyFavoritedChromas);
        skinsData[equippedSkinData.uuid].chromas[chromaUuid].favorite = newState;
    }


    //getters
    function refreshFavorited() {
        setIsFavoriteSkin(equippedSkinData.favorite);
    }

    function refreshFavoritedLevels() {
        var levels = equippedSkinData.levels;
        var favLevels = [];
        for (const level_uuid of Object.keys(levels)) {
            var level = levels[level_uuid];
            if (level.favorite) {
                favLevels.push(level.uuid);
            }
        }
        setFavoriteLevels(favLevels);

        if (favLevels.includes(equippedLevelData.uuid)) {
            setIsFavoriteLevel(true);
        } else {
            setIsFavoriteLevel(false);
        }

        // cant favorite stuff with only one level
        if (Object.keys(levels).length === 1) {
            setCanFavoriteLevel(false);
        } else {
            setCanFavoriteLevel(true);
        }

    }

    function refreshFavoritedChromas() {
        var chromas = equippedSkinData.chromas;
        var favChromas = [];
        for (const chroma_uuid of Object.keys(chromas)) {
            var chroma = chromas[chroma_uuid];
            if (chroma.favorite) {
                favChromas.push(chroma.uuid);
            }
        }
        setFavoriteChromas(favChromas)

        if (favChromas.includes(equippedChromaData.uuid)) {
            setIsFavoriteChroma(true);
        } else {
            setIsFavoriteChroma(false);
        }

        if (Object.keys(chromas).length === 1) {
            setCanFavoriteChroma(false);
        } else {
            setCanFavoriteChroma(true);
        }
    }

    //skin media stuff
    function updateAlternateMedia() {
        changeAlternateMediaState(equippedChromaData.video_preview !== null || equippedLevelData.video_preview !== null)
    }

    function getSkinMedia() {
        var showChromaVideo = false;
        var showLevelImage = false;
        if (equippedChromaData.video_preview !== null) {
            showChromaVideo = true;
        }
        if (equippedChromaData.index === 1 && equippedLevelData.display_icon !== null && !(equippedSkinData.display_name.includes("Standard"))) {
            showLevelImage = true;
        }
        if (!showingVideo) {
            return (
                <Grow in>
                    <img alt={equippedChromaData.display_name} src={showLevelImage ? equippedLevelData.display_icon : equippedChromaData.display_icon} style={{ maxWidth: "90%", maxHeight: "85%", objectFit: "contain", alignSelf: "center", overflow: "hidden" }} />
                </Grow>
            )
        } else if (showingVideo && equippedLevelData.video_preview !== null) {
            return (
                <Grow in>
                    <video src={showChromaVideo ? equippedChromaData.video_preview : equippedLevelData.video_preview} type="video/mp4" controls={showingControls} autoPlay onEnded={() => { changeVideoState(false) }} style={{ width: "auto", height: "100%", overflow: "hidden", objectFit: "contain", flexGrow: 1, alignSelf: "center" }} />
                </Grow>
            )
        } else {
            changeVideoState(false);
        }

    }

    function saveWeight(weight, total) {
        setWeightDialogOpen(false);
        equippedSkinData.weight = weight;
        inventoryWeaponData.total_weights = total;
        console.log(weight);
    }


    if (inventoryWeaponData == null && initSkinData == null) {

        return (
            null// TODO: THIS SHOULD RETURN SOME SORT OF ERROR
        )

    } else {

        return (
            <Backdrop open={open} className={classes.backdrop} style={{ zIndex: 4 }}>
                <WeightDialog 
                    open={weightDialogOpen} 
                    close={setWeightDialogOpen} 
                    saveCallback={saveWeight} 
                    weight={equippedSkinData.weight}
                    totalWeights={inventoryWeaponData.total_weights}
                />
                {/* <Grid container className={classes.masterGrid} direction="row" justifyContent="center" alignItems="center">
                        <Grid item xl={4} lg={5} md={7} sm={11} xs={12} style={{ display: "flex", marginTop: "10px" }}> */}

                <Paper className={classes.mainPaper} variant="outlined">
                    <div className={classes.paperOnTopContent}>

                        <WeaponHeader
                            equippedSkinData={equippedSkinData}
                            inventoryWeaponData={inventoryWeaponData}
                            saving={saving}
                            saveCallback={save}
                            isFavorite={isFavoriteSkin}
                            favoriteCallback={toggleFavoritedSkin}
                            isLocked={isLocked}
                            lockCallback={toggleLock}
                            weightCallback={setWeightDialogOpen}
                        />

                        <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>

                            <Paper variant="outlined" outlinecolor="secondary" className={classes.mainSkinMedia} style={{ height: (showingVideo ? "35vh" : "125px"), maxHeight: "350px", maxWidth: "100%", overflowX: "hidden" }}>
                                {getSkinMedia()}
                            </Paper>

                            <ActionsDrawer
                                hasAlternateMedia={hasAlternateMedia}
                                showingVideo={showingVideo}
                                changeVideoStateCallback={changeVideoState}
                                showingControls={showingControls}
                                changeControlsStateCallback={changeControlsState}
                                toggleFavoriteLevelCallback={toggleFavoritedLevel}
                                isFavoriteLevel={isFavoriteLevel}
                                toggleFavoriteChromaCallback={toggleFavoritedChroma}
                                isFavoriteChroma={isFavoriteChroma}
                                canFavoriteLevel={canFavoriteLevel}
                                canFavoriteChroma={canFavoriteChroma}
                            />

                        </div>
                    </div>

                    <div className={classes.paperCustomizingContent}>

                        <div className={classes.levelSelectors} style={{ height: (hasUpgrades ? "45px" : "0px") }}>
                            <LevelSelector levelData={equippedSkinData.levels} equippedLevelIndex={equippedLevelData.index} equippedChromaIndex={equippedChromaData.index} setter={setEquippedLevelData} />
                            <ChromaSelector levelData={equippedSkinData.levels} chromaData={equippedSkinData.chromas} equippedLevelIndex={equippedLevelData.index} equippedChromaIndex={equippedChromaData.index} setter={setEquippedChromaData} />
                        </div>

                        {hasUpgrades ? <Divider variant="middle" /> : null}

                        <div className={classes.skinSelector}>
                            <Grid style={{ width: "100%", height: "100%", justifySelf: "center" }} container justifyContent="flex-start" direction="row" alignItems="center" spacing={1}>

                                {Object.keys(skinsData).map(uuid => {
                                    var data = skinsData[uuid];
                                    return (
                                        <Grid item key={data.display_name} xs={4}>
                                            <Weapon skinData={data} weaponData={inventoryWeaponData} equip={equipSkin} equipped={equippedSkinData} />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </div>


                    </div>


                </Paper>
                {/* </Grid>
                    </Grid> */}
            </Backdrop>
        )
    }
}

export default WeaponEditor