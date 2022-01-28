import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Typography, Tooltip, IconButton, Grow, Divider } from '@material-ui/core'

//icons
import { Close, Autorenew, LockOpen, Lock, Favorite, FavoriteBorder, FitnessCenter, } from '@material-ui/icons'

import { Config } from "../../../services/ClientConfig"


const useStyles = makeStyles((theme) => ({
    "@global": {
        "@keyframes spin": {
            "0%": {
                transform: "rotate(-360deg)"
            },
            "100%": {
                transform: "rotate(0deg)"
            }
        }
    },

    header: {
        width: "auto",
        display: "flex",
        marginTop: "15px",
        flexWrap: "wrap",
        flexDirection: "row-reverse"
    },

    headerButton: {
        marginLeft: theme.spacing(.25),
    },

    loading: {
        animation: "spin 4s linear infinite",
    }

}))

function WeaponHeader(props) {
    const classes = useStyles();
    const theme = useTheme();

    const selectedSkinData = props.selectedSkinData;
    const inventoryWeaponData = props.inventoryWeaponData;

    const saving = props.saving;
    const saveCallback = props.saveCallback;

    const favorite = props.isFavorite
    const favoriteCallback = props.favoriteCallback;
    
    const locked = props.isLocked
    const lockCallback = props.lockCallback;

    const weightCallback = props.weightCallback;

    return (
        <div className={classes.header}>
            <div style={{ display: "flex", "order": 2, flexGrow: 1 }}>
                <div style={{ width: "auto", alignSelf: "center" }}>
                    {selectedSkinData.content_tier.dev_name !== "Standard" ? 
                    <img alt={selectedSkinData.content_tier.dev_name} src={selectedSkinData.content_tier.display_icon} style={{ width: "auto", height: "40px", justifySelf: "center", marginRight: "10px" }} />
                    : null}
                </div>

                <div>
                    <Typography variant="h5">
                        {selectedSkinData.display_name}
                    </Typography>
                    <Typography variant="overline">
                        {selectedSkinData.content_tier.dev_name !== "Battlepass" ? selectedSkinData.content_tier.dev_name : "Unlockable"} {inventoryWeaponData.display_name} {selectedSkinData.favorite ? `// ${Math.round((selectedSkinData.weight/inventoryWeaponData.total_weights)*100)}% CHANCE (${selectedSkinData.weight}/${inventoryWeaponData.total_weights})` : null}
                    </Typography>
                </div>
            </div>

            <div style={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>

                <Grow in={favorite} mountOnEnter unmountOnExit>
                    <Tooltip title="Set randomizer weight" className={classes.headerButton}>
                        <IconButton onClick={() => {weightCallback(true)}} style={{ height: "40px", width: "40px" }}>
                            <FitnessCenter />
                        </IconButton>
                    </Tooltip>
                </Grow>

                <Tooltip title={favorite ? "Remove skin from favorites" : "Add skin to favorites"} className={classes.headerButton}>
                    <IconButton onClick={favoriteCallback} style={{ height: "40px", width: "40px" }}>
                        {favorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" variant="middle" style={{height: "40px",}} />

                <Tooltip title={locked ? "Unlock weapon from randomization" : "Lock weapon from randomization"} className={classes.headerButton}>
                    <IconButton onClick={lockCallback} style={{ height: "40px", width: "40px" }}>
                        {locked ? <Lock /> : <LockOpen />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Save" className={classes.headerButton}>
                    <IconButton onClick={saveCallback} style={{ height: "40px", width: "40px" }}>
                        {saving ? <Autorenew className={classes.loading} /> : <Close />}
                    </IconButton>
                </Tooltip>
            </div>

        </div>
    )
}

export default WeaponHeader;