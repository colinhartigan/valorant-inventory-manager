import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Typography, Tooltip, CircularProgress, IconButton } from '@material-ui/core'

//icons
import { Close, RemoveCircleOutline, AddCircleOutline, Favorite, FavoriteBorder } from '@material-ui/icons'


const useStyles = makeStyles((theme) => ({
    header: {
        width: "auto",
        display: "flex",
        marginTop: "15px",
        flexWrap: "wrap",
    },

    headerButton: {
        marginLeft: theme.spacing(.25),
    }

}))

function WeaponHeader(props) {
    const classes = useStyles();
    const theme = useTheme();

    const equippedSkinData = props.equippedSkinData;
    const inventoryData = props.inventoryData;

    const saving = props.saving;
    const saveCallback = props.saveCallback;

    const favorite = props.isFavorite
    const favoriteCallback = props.favoriteCallback;

    return (
        <div className={classes.header}>
            <div style={{ width: "auto", alignSelf: "center" }}>
                {equippedSkinData.content_tier.dev_name !== "Standard" ? 
                <img alt={equippedSkinData.content_tier.dev_name} src={equippedSkinData.content_tier.display_icon} style={{ width: "auto", height: "40px", justifySelf: "center", marginRight: "10px" }} />
                : null}
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

                <Tooltip title={favorite ? "Remove skin from favorites" : "Add skin to favorites"} className={classes.headerButton}>
                    <IconButton onClick={favoriteCallback} style={{ height: "40px", width: "40px" }}>
                        {favorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                </Tooltip>


                <Tooltip title="Save" className={classes.headerButton}>
                    {
                        saving ? <CircularProgress color={theme.palette.secondary.dark} style={{ margin: "10px", height: "20px", width: "20px" }} /> :
                            <IconButton onClick={saveCallback} style={{ height: "40px", width: "40px" }}>
                                <Close />
                            </IconButton>
                    }
                </Tooltip>
            </div>

        </div>
    )
}

export default WeaponHeader;