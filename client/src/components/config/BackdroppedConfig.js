import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper, Backdrop, Typography, Divider, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'

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
        minWidth: "400px",
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
            <Paper variant="outlined" className={classes.mainPaper}>
                <Config close={props.close}/>
                
            </Paper>
        </Backdrop>
    )
}

export default BackdroppedConfig;