import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Paper, Tooltip, CircularProgress, IconButton, Zoom, Grow } from '@mui/material'

//icons 
import { Theaters, TheatersOutlined, Palette, Loyalty, LoyaltyOutlined, PaletteOutlined, PlayArrowOutlined, StopOutlined } from '@mui/icons-material'

const useStyles = makeStyles((theme) => ({

    selectedActions: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
        marginLeft: "10px",
        padding: "2px",
        transition: "all .2s ease !important",
    },

    previewAction: {
        height: "35px",
        width: "35px",
        alignSelf: "center",
        margin: theme.spacing(.25),
        transition: "all .2s ease !important",
    },

    previewActionIcon: {
        width: "20px",
        height: "20px",
    },

}))

function ActionsDrawer(props) {
    const classes = useStyles();
    const theme = useTheme();

    const hasAlternateMedia = props.hasAlternateMedia
    const showingVideo = props.showingVideo
    const changeVideoState = props.changeVideoStateCallback

    const showingControls = props.showingControls 
    const changeControlsState = props.changeControlsStateCallback

    const levelFavorited = props.isFavoriteLevel
    const chromaFavorited = props.isFavoriteChroma
    const toggleFavoriteLevelCallback = props.toggleFavoriteLevelCallback
    const toggleFavoriteChromaCallback = props.toggleFavoriteChromaCallback
    const canFavoriteLevel = props.canFavoriteLevel
    const canFavoriteChroma = props.canFavoriteChroma
    const equipable = props.equipable
    const profileData = props.profileData

    const visible = (hasAlternateMedia || canFavoriteLevel || canFavoriteChroma)

    return <>
        <Grow in={visible} mountOnEnter unmountOnExit>
            <Paper variant="outlined" outlinecolor="secondary" className={classes.selectedActions}>

                <Zoom in={equipable && canFavoriteLevel} mountOnEnter unmountOnExit>
                    <Tooltip title={levelFavorited ? "Remove level from favorites" : "Add level to favorites"}>
                        <IconButton
                            onClick={() => {toggleFavoriteLevelCallback()}}
                            aria-label="favorite level"
                            className={classes.previewAction}
                            size="large">
                            {levelFavorited ? <Loyalty className={classes.previewActionIcon} /> : <LoyaltyOutlined className={classes.previewActionIcon} />}
                        </IconButton>
                    </Tooltip>
                </Zoom>

                <Zoom in={equipable && canFavoriteChroma} mountOnEnter unmountOnExit>
                    <Tooltip title={chromaFavorited ? "Remove chroma from favorites" : "Add chroma to favorites"}>
                        <IconButton
                            onClick={() => {toggleFavoriteChromaCallback()}}
                            aria-label="favorite chroma"
                            className={classes.previewAction}
                            size="large">
                            {chromaFavorited ? <Palette className={classes.previewActionIcon} /> : <PaletteOutlined className={classes.previewActionIcon} />}
                        </IconButton>
                    </Tooltip>
                </Zoom>

                <Zoom in={hasAlternateMedia} mountOnEnter unmountOnExit>
                    <Tooltip title={showingVideo ? "Stop video preview" : "Play video preview"}>
                        <IconButton
                            onClick={() => { changeVideoState(!showingVideo) }}
                            aria-label="preview"
                            className={classes.previewAction}
                            size="large">
                            {showingVideo ? <StopOutlined className={classes.previewActionIcon} /> : <PlayArrowOutlined className={classes.previewActionIcon} />}
                        </IconButton>
                    </Tooltip>
                </Zoom>

                <Zoom in={showingVideo} mountOnEnter unmountOnExit>
                    <Tooltip title={showingControls ? "Hide video controls" : "Show video controls"}>
                        <IconButton
                            onClick={() => { changeControlsState(!showingControls) }}
                            aria-label="preview"
                            className={classes.previewAction}
                            size="large">
                            {showingControls ? <Theaters className={classes.previewActionIcon} /> : <TheatersOutlined className={classes.previewActionIcon} />}
                        </IconButton>
                    </Tooltip>
                </Zoom>

            </Paper>
        </Grow>
    </>;
}

export default ActionsDrawer;