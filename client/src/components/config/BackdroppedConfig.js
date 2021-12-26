import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper, Backdrop, Slide, Divider, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'

//icons 
import { Theaters, TheatersOutlined, Palette, Loyalty, LoyaltyOutlined, PaletteOutlined, PlayArrowOutlined, StopOutlined } from '@material-ui/icons'

import Config from "./Config.js"

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
        minWidth: "450px",
        maxWidth: "600px",

        display: "flex",
        justifySelf: "flex-start",
        justifyContent: "center",
        alignContent: "flex-start",
        flexWrap: "wrap",
        overflow: "auto",
    },

}))

function BackdroppedConfig(props) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Backdrop open={props.open} className={classes.backdrop} style={{ zIndex: 4 }}>
            <Slide direction="up" in={props.open} mountOnEnter unmountOnExit>
                <Paper variant="outlined" className={classes.mainPaper}>
                    <Config close={props.close} showHeader/>
                </Paper>
            </Slide>
        </Backdrop>
    )
}

export default BackdroppedConfig;