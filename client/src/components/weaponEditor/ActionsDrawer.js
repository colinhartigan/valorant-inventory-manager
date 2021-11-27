import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper, Tooltip, CircularProgress, IconButton } from '@material-ui/core'

//icons 
import { Visibility, VisibilityOff, Palette, Loyalty, LoyaltyOutlined, PaletteOutlined, PlayArrowOutlined, StopOutlined } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({

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

}))

function ActionsDrawer(props) {
    const classes = useStyles();
    const theme = useTheme();

    const hasAlternateMedia = props.hasAlternateMedia
    const showingVideo = props.showingVideo
    const changeVideoState = props.changeVideoStateCallback

    const levelFavorited = props.isFavoriteLevel
    const chromaFavorited = props.isFavoriteChroma
    const toggleFavoriteLevelCallback = props.toggleFavoriteLevelCallback
    const toggleFavoriteChromaCallback = props.toggleFavoriteChromaCallback
    const canFavoriteLevels = props.canFavoriteLevels
    const canFavoriteChromas = props.canFavoriteChromas

    const visible = (hasAlternateMedia || canFavoriteLevels || canFavoriteChromas)

    return (
        <>
            {visible ?
                <Paper variant="outlined" outlinecolor="secondary" className={classes.equippedActions}>

                    {canFavoriteLevels ?
                        <Tooltip title={levelFavorited ? "Remove level from favorites" : "Add level to favorites"}>
                            <IconButton onClick={toggleFavoriteLevelCallback} aria-label="favorite level" className={classes.previewAction}>
                                {levelFavorited ? <Loyalty className={classes.previewActionIcon} /> : <LoyaltyOutlined className={classes.previewActionIcon} />}
                            </IconButton>
                        </Tooltip>
                        : null
                    }

                    {canFavoriteChromas ?
                        <Tooltip title={chromaFavorited ? "Remove chroma from favorites" : "Add chroma to favorites"}>
                            <IconButton onClick={toggleFavoriteChromaCallback} aria-label="favorite chroma" className={classes.previewAction}>
                                {chromaFavorited ? <Palette className={classes.previewActionIcon} /> : <PaletteOutlined className={classes.previewActionIcon} />}
                            </IconButton>
                        </Tooltip>
                        : null
                    }


                    {
                        hasAlternateMedia ?
                            <Tooltip title={showingVideo ? "Stop video preview" : "Play video preview"}>
                                <IconButton onClick={() => { changeVideoState(!showingVideo) }} aria-label="preview" className={classes.previewAction}>
                                    {showingVideo ? <StopOutlined className={classes.previewActionIcon} /> : <PlayArrowOutlined className={classes.previewActionIcon} />}
                                </IconButton>
                            </Tooltip>
                            : null
                    }

                </Paper>
                : null}
        </>
    )
}

export default ActionsDrawer;