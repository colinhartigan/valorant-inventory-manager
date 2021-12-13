import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper, Backdrop, CircularProgress, IconButton, Zoom, Grow } from '@material-ui/core'

//icons 
import { Theaters, TheatersOutlined, Palette, Loyalty, LoyaltyOutlined, PaletteOutlined, PlayArrowOutlined, StopOutlined } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({

    backdrop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    mainPaper: {
        margin: "auto",
        width: "40%",
        height: "70vh",
        minWidth: "400px",
        maxWidth: "550px",

        display: "flex",
        justifySelf: "flex-start",
        justifyContent: "center",
        alignContent: "flex-start",
        flexWrap: "wrap",
        overflow: "auto",
    }

}))

function Config(props) {
    const classes = useStyles();
    const theme = useTheme();


    return (
        <Backdrop open={false} className={classes.backdrop} style={{ zIndex: 4 }}>
            <Paper className={classes.mainPaper}>
                asdf
            </Paper>
        </Backdrop>
    )
}

export default Config;