import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useConfig } from '../../services/useConfig'

//components
import { Grow, Backdrop, Paper, Grid, Container, Divider, IconButton, Tooltip, Button } from '@mui/material';

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
        background: "#121212",
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
        width: "95%",
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
        alignItems: "center",
        justifyContent: "center",
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
    const profileWeaponData = props.profileData.skins[props.weaponUuid]
    const inventorySkinsData = inventoryWeaponData.skins
    const profileSkinsData = profileWeaponData.skins
    const initSkinData = props.initialSkinData

    //skin data states
    const [profileSelectedSkinData, setProfileSelectedSkinData] = useState(profileSkinsData[initSkinData.skin_uuid] !== undefined ? profileSkinsData[initSkinData.skin_uuid] : generateDummyProfileData(initSkinData.skin_uuid));
    const [selectedSkinData, setSelectedSkinData] = useState(inventorySkinsData[initSkinData.skin_uuid]);
    const [selectedLevelData, setSelectedLevelData] = useState(inventorySkinsData[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
    const [selectedChromaData, setSelectedChromaData] = useState(inventorySkinsData[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])

    //equipped states
    const [equippedSkinData, setEquippedSkinData] = useState(inventorySkinsData[initSkinData.skin_uuid]);
    const [equippedLevelData, setEquippedLevelData] = useState(inventorySkinsData[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
    const [equippedChromaData, setEquippedChromaData] = useState(inventorySkinsData[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])
    const [equippedDataSelected, setEquippedDataSelected] = useState(true)
    const [selectedSkinIsEquipped, setSelectedSkinIsEquipped] = useState(false)
    const [equipable, setEquipable] = useState(false)

    //favorites states
    const [isFavoriteSkin, setIsFavoriteSkin] = useState(profileSkinsData[initSkinData.skin_uuid].favorite)
    const [favoriteLevels, setFavoriteLevels] = useState();
    const [favoriteChromas, setFavoriteChromas] = useState();

    const [canFavoriteLevel, setCanFavoriteLevel] = useState(true)
    const [canFavoriteChroma, setCanFavoriteChroma] = useState(true)
    const [canFavoriteSkin, setCanFavoriteSkin] = useState(true)

    const [isFavoriteLevel, setIsFavoriteLevel] = useState(false);
    const [isFavoriteChroma, setIsFavoriteChroma] = useState(false);

    //locked states
    const [isLocked, setIsLocked] = useState(profileWeaponData.locked);

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

    //config
    const [config] = useConfig();
    const showLockedSkins = config.app.settings.show_locked_skins.value;


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
        selectSkin(initSkinData.skin_uuid);
        setSelectedLevelData(inventorySkinsData[initSkinData.skin_uuid].levels[props.loadoutWeaponData.level_uuid])
        setSelectedChromaData(inventorySkinsData[initSkinData.skin_uuid].chromas[props.loadoutWeaponData.chroma_uuid])
    }, [])

    function generateDummyProfileData(skinUuid) {
        const invData = inventorySkinsData[skinUuid]
            
        var dummyProfileSkinData = {
            favorite: false,
            weight: 0,
            levels: {},
            chromas: {},
        }

        for(var levelUuid in invData.levels){
            dummyProfileSkinData.levels[levelUuid] = {
                favorite: false,
            }
        }

        for(var chromaUuid in invData.chromas){
            dummyProfileSkinData.chromas[chromaUuid] = {
                favorite: false,
            }
        }

        console.log(dummyProfileSkinData)

        return dummyProfileSkinData
    }

    // keyboard listeners
    useEffect(() => {
        //console.log(keysDown)

        switch (keysDown.join(' ')) {
            case 'f':
                toggleFavoritedSkin();
                break;

            case 'l':
                toggleLock();
                break;

            case 'Escape':
                save();
                break;

            case 'e':
                equipSkin();
                break;

            case 'c':
                toggleFavoritedChroma();
                break;

            case 'v':
                toggleFavoritedLevel();
                break;

            case 'w':
                setWeightDialogOpen(true);
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

        var equipable = false;
        if (selectedLevelData.unlocked === true && selectedChromaData.unlocked === true) {
            equipable = true;
        }
        setEquipable(equipable);
    }

    function save() {
        //update if there were changes to favorites and stuff
        console.log(equippedSkinData)
        setSaving(true);
        var data = {
            weaponUuid: props.weaponUuid,
            skinUuid: equippedSkinData["uuid"],
            levelUuid: equippedLevelData["uuid"],
            chromaUuid: equippedChromaData["uuid"],
            //inventoryData: inventoryWeaponData,
            profileData: profileWeaponData,
            profileUuid: props.profileData.uuid,
            //inventorySkinsData: inventorySkinsData,
        }
        var oldSkinId = initSkinData.skin_uuid
        var oldChromaId = initSkinData.chroma_uuid
        var oldLevelId = initSkinData.level_uuid
        var sameSkin = selectedLevelData["uuid"] === oldLevelId && selectedChromaData["uuid"] === oldChromaId && selectedSkinData["uuid"] === oldSkinId;

        close();
        props.saveCallback(inventoryWeaponData.display_name, data, sameSkin)
            .then(() => {
                
            });
    }

    function close() {
        changeOpenState(false);
        setTimeout(() => {
            props.closeEditor();
        }, 100)
    }

    function selectSkin(skinUuid) {
        var skinData = inventorySkinsData[skinUuid];
        var highestLevelOwnedIndex = 1;

        for (var i = 0; i < Object.keys(skinData.levels).length; i++) {
            if (skinData.levels[Object.keys(skinData.levels)[i]].unlocked === true) {
                highestLevelOwnedIndex = skinData.levels[Object.keys(skinData.levels)[i]].index;
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

        var levelData = skinData.levels[Object.keys(skinData.levels)[highestLevelOwnedIndex - 1]];
        var chromaData = skinData.chromas[Object.keys(skinData.chromas)[0]];
        var profileData = profileSkinsData[skinData.uuid] !== undefined ? profileSkinsData[skinData.uuid] : generateDummyProfileData(skinData.uuid)

        setProfileSelectedSkinData(profileData);
        setSelectedSkinData(skinData);
        setSelectedSkinIsEquipped(skinData.uuid === equippedSkinData.uuid);
        setSelectedLevelData(levelData);
        setSelectedChromaData(chromaData);
        // setIsFavoriteLevel(profileData.levels[levelData.uuid].favorite);
        // setIsFavoriteChroma(profileData.chromas[chromaData.uuid].favorite);
        changeVideoState(false);
        changeControlsState(false);
    }

    function equipSkin() {
        if (equipable) {
            setEquippedSkinData(selectedSkinData);
            setEquippedLevelData(selectedLevelData);
            setEquippedChromaData(selectedChromaData);
            setSelectedSkinIsEquipped(true);
        }
    }

    useEffect(() => {
        if (selectedSkinData.uuid === equippedSkinData.uuid && selectedLevelData.uuid === equippedLevelData.uuid && selectedChromaData.uuid === equippedChromaData.uuid) {
            setEquippedDataSelected(true)
        } else {
            setEquippedDataSelected(false)
        }
    }, [selectedSkinData, selectedLevelData, selectedChromaData, equippedChromaData, equippedSkinData, equippedLevelData])

    // lock a weapon's skin so it can't be changed by randomizer
    function toggleLock() {
        setIsLocked(!profileWeaponData.locked);
        profileWeaponData.locked = !profileWeaponData.locked;
    }

    //favorites system
    //if a chroma is favorited, level 4 must also be favorited
    //if a level is favorited, chroma 1 must also be favorited
    function toggleFavoritedSkin() {
        profileSelectedSkinData.favorite = !isFavoriteSkin;
        if (!isFavoriteSkin) {
            profileWeaponData.total_weights += profileSelectedSkinData.weight;
        } else {
            profileWeaponData.total_weights -= profileSelectedSkinData.weight;
        }
        setIsFavoriteSkin(!isFavoriteSkin);
    }

    function toggleFavoritedLevel(levelUuidOverride = null, stateOverride = null) {
        if(!equipable)
            return;

        var levelUuid
        if (levelUuidOverride === null) {
            levelUuid = selectedLevelData.uuid;
        } else {
            levelUuid = levelUuidOverride;
        }

        var currentlyFavoritedLevels = favoriteLevels;
        var newState;

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
        profileSelectedSkinData.levels[selectedLevelData.uuid].favorite = newState;
    }

    function toggleFavoritedChroma(chromaUuidOverride = null, stateOverride = null) {
        if(!equipable)
            return;

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
        profileSelectedSkinData.chromas[chromaUuid].favorite = newState;
    }

    function refreshFavorited() {
        setIsFavoriteSkin(profileSelectedSkinData.favorite);
        setCanFavoriteSkin(selectedSkinData.unlocked)
    }

    function refreshFavoritedLevels() {
        var levels = profileSelectedSkinData.levels;
        var favLevels = [];
        for (const level_uuid of Object.keys(levels)) {
            var level = levels[level_uuid];
            if (level.favorite) {
                favLevels.push(level_uuid);
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
        var chromas = profileSelectedSkinData.chromas;
        var favChromas = [];
        for (const chroma_uuid of Object.keys(chromas)) {
            var chroma = chromas[chroma_uuid];
            if (chroma.favorite) {
                favChromas.push(chroma_uuid);
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
        profileSelectedSkinData.weight = weight;
        profileWeaponData.total_weights = total;
    }


    if (inventoryWeaponData == null && initSkinData == null) {

        return (
            null
        )

    } else {

        return (
            <Backdrop open={open} className={classes.backdrop} style={{ zIndex: 4 }}>
                <WeightDialog
                    open={weightDialogOpen}
                    close={setWeightDialogOpen}
                    saveCallback={saveWeight}
                    weight={profileSelectedSkinData.weight}
                    totalWeights={profileWeaponData.total_weights}
                />
                <Container maxWidth={"lg"}>
                    <Paper className={classes.mainPaper} variant="outlined">
                        <div className={classes.paperOnTopContent}>

                            <WeaponHeader
                                selectedSkinData={selectedSkinData}
                                profileSelectedSkinData={profileSelectedSkinData}
                                inventoryWeaponData={inventoryWeaponData}
                                profileWeaponData={profileWeaponData}
                                saving={saving}
                                saveCallback={save}
                                isFavorite={isFavoriteSkin}
                                canFavorite={canFavoriteSkin}
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
                                    equipable={equipable}
                                />

                            </div>

                            <div className={classes.levelSelectors} style={{ marginTop: (hasUpgrades ? "12px" : "0px"), height: (hasUpgrades ? "auto" : "0px"), trainsition: "height 0.5s ease" }}>
                                <Grid container spacing={0} style={{}}>
                                    <Grid item xs={12} sm={6} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", }}>
                                        <LevelSelector
                                            levelData={selectedSkinData.levels}
                                            profileLevelData={profileSelectedSkinData.levels}
                                            selectedLevelIndex={selectedLevelData.index}
                                            selectedChromaIndex={selectedChromaData.index}
                                            equippedLevelIndex={equippedLevelData.index}
                                            selectedSkinIsEquipped={selectedSkinIsEquipped}
                                            setter={setSelectedLevelData}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", }}>
                                        <ChromaSelector
                                            levelData={selectedSkinData.levels}
                                            chromaData={selectedSkinData.chromas}
                                            profileChromaData={profileSelectedSkinData.chromas}
                                            selectedLevelIndex={selectedLevelData.index}
                                            selectedChromaIndex={selectedChromaData.index}
                                            equippedChromaIndex={equippedChromaData.index}
                                            selectedSkinIsEquipped={selectedSkinIsEquipped}
                                            setter={setSelectedChromaData}
                                        />
                                    </Grid>
                                </Grid>

                            </div>

                            <Button variant="outlined" color="primary" onClick={equipSkin} disabled={equippedDataSelected ? true : false || !equipable} style={{ marginTop: "10px", width: "100%", }}>
                                {equipable ? (!equippedDataSelected ? `Equip ${selectedSkinData.display_name}${selectedLevelData.index !== 1 ? ` // level ${selectedLevelData.index}` : ''}${selectedChromaData.index !== 1 ? ` // ${selectedChromaData.display_name}` : ''}` : 'Equipped') : "Locked"}
                            </Button>

                            <Divider variant="middle" style={{ marginTop: "12px", }} />

                        </div>


                        <div className={classes.paperCustomizingContent} style={{ transition: "all 0.5s ease" }}>


                            <div className={classes.skinSelector}>
                                <Grid style={{ width: "100%", height: "100%", justifySelf: "center" }} container justifyContent="flex-start" direction="row" alignItems="center" spacing={2}>

                                    {Object.keys(inventorySkinsData).map(uuid => {
                                        var data = inventorySkinsData[uuid];
                                        var profileData = profileSkinsData[uuid];
                                        if (!data.unlocked && !showLockedSkins) {
                                            return null;
                                        } else {
                                            return (
                                                <Grid item key={data.display_name} xs={4}>
                                                    <Weapon skinData={data} profileData={profileData} weaponData={inventoryWeaponData} select={selectSkin} selected={selectedSkinData} equipped={data.uuid === equippedSkinData.uuid} />
                                                </Grid>
                                            )
                                        }
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