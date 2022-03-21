import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grow, Backdrop, Paper, Grid, Container, Divider, IconButton, Tooltip, ClickAwayListener } from '@material-ui/core';

import LevelSelector from './sub/LevelSelector.js';
import ChromaSelector from './sub/ChromaSelector.js';
import Weapon from './sub/SkinGridItem.js';
import WeaponHeader from './sub/WeaponHeader.js';
import ActionsDrawer from './sub/ActionsDrawer.js';
import WeightDialog from './sub/WeightDialog.js'

import useKeyboardListener from '../../services/useKeyboardListener.js'


const useStyles = makeStyles((theme) => ({

    backdrop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    mainPaper: {
        margin: "auto",
        width: "100%",
        height: "90vh",
        minWidth: "400px",
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
        width: "93%",
        background: "#424242",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "5px",
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
        maxHeight: "350px",
        maxWidth: "100%",
        overflowX: "hidden",
        transition: "all 0.5s ease-in-out",
    },

    //container for subcomponents
    paperCustomizingContent: {
        width: "93%",
        height: "auto",
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
    const [selectedSkinData, setselectedSkinData] = useState(skinsData[initSkinData.skin_uuid]);
    const [selectedLevelData, setselectedLevelData] = useState(skinsData[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
    const [selectedChromaData, setselectedChromaData] = useState(skinsData[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])

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
    const [hasWallpaper, setHasWallpaper] = useState(false);

    //video states
    const [showingVideo, changeVideoState] = useState(false);
    const [hasAlternateMedia, changeAlternateMediaState] = useState(false);
    const [showingControls, changeControlsState] = useState(false);

    //weight dialog states
    const [weightDialogOpen, setWeightDialogOpen] = useState(false);

    //keyboard state
    const [keysDown] = useKeyboardListener();


    //effect listeners
    useEffect(() => {
        if (open) {
            document.title = `VIM // ${inventoryWeaponData.display_name}`
        }
    }, [open])

    // things that should update whenever skin, level, or chroma changes
    useEffect(() => {
        refresh();
    }, [selectedSkinData, selectedLevelData, selectedChromaData])

    // on initial open, update level/chroma selectors
    useEffect(() => {
        equipSkin(initSkinData.skin_uuid);
        setselectedLevelData(skinsData[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
        setselectedChromaData(skinsData[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])
    }, [])


    // keyboard listeners
    useEffect(() => {
        console.log(keysDown)

        switch (keysDown.join(' ')){
            case 'f':
                toggleFavoritedSkin();
                break;
            
            case 'l':
                toggleLock();
                break;

            case 'Escape':
                save();
                break; 

            default:
                break;
        }

    }, [keysDown])

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
            skinUuid: selectedSkinData["uuid"],
            levelUuid: selectedLevelData["uuid"],
            chromaUuid: selectedChromaData["uuid"],
            inventoryData: inventoryWeaponData,
            skinsData: skinsData,
        }
        var oldSkinId = initSkinData.skin_uuid
        var oldChromaId = initSkinData.chroma_uuid
        var oldLevelId = initSkinData.level_uuid
        var sameSkin = selectedLevelData["uuid"] === oldLevelId && selectedChromaData["uuid"] === oldChromaId && selectedSkinData["uuid"] === oldSkinId;

        var payload = JSON.stringify(data);
        props.saveCallback(payload, sameSkin)
            .then(() => {
                close();
            });
    }

    function close() {
        changeOpenState(false);
        setTimeout(() => {
            props.closeEditor();
        }, 100)
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

        if (skinData.wallpaper !== null) {
            setHasWallpaper(true);
        } else {
            setHasWallpaper(false);
        }

        setselectedSkinData(skinData);
        setselectedLevelData(skinData.levels[Object.keys(skinData.levels)[highestLevelIndex - 1]]);
        setselectedChromaData(skinData.chromas[Object.keys(skinData.chromas)[0]]);
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
        skinsData[selectedSkinData.uuid].favorite = !isFavoriteSkin;
        if (!isFavoriteSkin) {
            inventoryWeaponData.total_weights += selectedSkinData.weight;
        } else {
            inventoryWeaponData.total_weights -= selectedSkinData.weight;
        }
        setIsFavoriteSkin(!isFavoriteSkin);
    }

    function toggleFavoritedLevel(levelUuidOverride = null, stateOverride = null) {

        var levelUuid
        if (levelUuidOverride === null) {
            levelUuid = selectedLevelData.uuid;
        } else {
            levelUuid = levelUuidOverride;
        }

        var currentlyFavoritedLevels = favoriteLevels;

        var newState
        if (stateOverride === null) {
            newState = !currentlyFavoritedLevels.includes(selectedLevelData.uuid)
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
        skinsData[selectedSkinData.uuid].levels[selectedLevelData.uuid].favorite = newState;
    }

    function toggleFavoritedChroma(chromaUuidOverride = null, stateOverride = null) {
        var chromaUuid
        if (chromaUuidOverride === null) {
            chromaUuid = selectedChromaData.uuid;
            console.log(chromaUuid)
        } else {
            chromaUuid = chromaUuidOverride;
        }

        var currentlyFavoritedChromas = favoriteChromas;

        var newState
        if (stateOverride === null) {
            newState = !currentlyFavoritedChromas.includes(selectedChromaData.uuid)
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
        skinsData[selectedSkinData.uuid].chromas[chromaUuid].favorite = newState;
    }

    function refreshFavorited() {
        setIsFavoriteSkin(selectedSkinData.favorite);
    }

    function refreshFavoritedLevels() {
        var levels = selectedSkinData.levels;
        var favLevels = [];
        for (const level_uuid of Object.keys(levels)) {
            var level = levels[level_uuid];
            if (level.favorite) {
                favLevels.push(level.uuid);
            }
        }
        setFavoriteLevels(favLevels);

        if (favLevels.includes(selectedLevelData.uuid)) {
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
        var chromas = selectedSkinData.chromas;
        var favChromas = [];
        for (const chroma_uuid of Object.keys(chromas)) {
            var chroma = chromas[chroma_uuid];
            if (chroma.favorite) {
                favChromas.push(chroma.uuid);
            }
        }
        setFavoriteChromas(favChromas)

        if (favChromas.includes(selectedChromaData.uuid)) {
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

    // --------------------------------------------------

    //skin media stuff
    function updateAlternateMedia() {
        changeAlternateMediaState(selectedChromaData.video_preview !== null || selectedLevelData.video_preview !== null)
    }

    function getSkinMedia() {
        var showChromaVideo = false;
        var showLevelImage = false;
        if (selectedChromaData.video_preview !== null) {
            showChromaVideo = true;
        }
        if (selectedChromaData.index === 1 && selectedLevelData.display_icon !== null && !(selectedSkinData.display_name.includes("Standard"))) {
            showLevelImage = true;
        }
        if (!showingVideo) {
            return (
                <Grow in>
                    <img alt={selectedChromaData.display_name} src={showLevelImage ? selectedLevelData.display_icon : selectedChromaData.display_icon} style={{ maxWidth: "90%", maxHeight: "85%", objectFit: "contain", alignSelf: "center", overflow: "hidden" }} />
                </Grow>
            )
        } else if (showingVideo && selectedLevelData.video_preview !== null) {
            return (
                <Grow in>
                    <video src={showChromaVideo ? selectedChromaData.video_preview : selectedLevelData.video_preview} type="video/mp4" controls={showingControls} autoPlay onEnded={() => { changeVideoState(false) }} style={{ width: "auto", height: "100%", overflow: "hidden", objectFit: "contain", flexGrow: 1, alignSelf: "center" }} />
                </Grow>
            )
        } else {
            changeVideoState(false);
        }

    }

    function saveWeight(weight, total) {
        setWeightDialogOpen(false);
        selectedSkinData.weight = weight;
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
                    weight={selectedSkinData.weight}
                    totalWeights={inventoryWeaponData.total_weights}
                />
                <Container maxWidth={"lg"}>
                    <Paper className={classes.mainPaper} variant="outlined">
                        <div className={classes.paperOnTopContent}>

                            <WeaponHeader
                                selectedSkinData={selectedSkinData}
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

                                <Paper
                                    variant="outlined"
                                    outlinecolor="secondary"
                                    className={classes.mainSkinMedia}
                                    style={{ height: (showingVideo ? "35vh" : "125px"), backgroundImage: (hasWallpaper ? `linear-gradient(90deg, rgba(66, 66, 66,.5) 0%, rgba(66, 66, 66,.5) 100%), url(${selectedSkinData.wallpaper})` : null), backgroundSize: "cover", backgroundPosition: "center", transition: "background-image 0.5s ease, height 0.2s ease" }}
                                >
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

                            <div className={classes.levelSelectors} style={{ marginTop: (hasUpgrades ? "12px" : "0px"), height: (hasUpgrades ? "auto" : "0px"), trainsition: "height 0.5s ease" }}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12} sm={6} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
                                        <LevelSelector levelData={selectedSkinData.levels} selectedLevelIndex={selectedLevelData.index} selectedChromaIndex={selectedChromaData.index} setter={setselectedLevelData} />
                                    </Grid>
                                    <Grid item xs={12} sm={6} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                                        <ChromaSelector levelData={selectedSkinData.levels} chromaData={selectedSkinData.chromas} selectedLevelIndex={selectedLevelData.index} selectedChromaIndex={selectedChromaData.index} setter={setselectedChromaData} />
                                    </Grid>
                                </Grid>

                            </div>

                            {hasUpgrades ? <Divider variant="middle" style={{marginTop: "10px",}} /> : null}

                            
                        </div>

                        <div className={classes.paperCustomizingContent} style={{ transition: "all 0.5s ease" }}>


                            <div className={classes.skinSelector}>
                                <Grid style={{ width: "100%", height: "100%", justifySelf: "center" }} container justifyContent="flex-start" direction="row" alignItems="center" spacing={2}>

                                    {Object.keys(skinsData).map(uuid => {
                                        var data = skinsData[uuid];
                                        return (
                                            <Grid item key={data.display_name} xs={4}>
                                                <Weapon skinData={data} weaponData={inventoryWeaponData} equip={equipSkin} selected={selectedSkinData} />
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </div>


                        </div>

                    </Paper>
                </Container>
            </Backdrop>
        )
    }
}

export default WeaponEditor