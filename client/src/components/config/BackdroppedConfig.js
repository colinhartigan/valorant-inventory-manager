import { React, useEffect, useState, forwardRef } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Paper, Dialog, Slide, Divider, Select, InputLabel, MenuItem, FormControl } from '@mui/material'

//icons 
import { Theaters, TheatersOutlined, Palette, Loyalty, LoyaltyOutlined, PaletteOutlined, PlayArrowOutlined, StopOutlined } from '@mui/icons-material'

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

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function BackdroppedConfig(props) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Dialog fullScreen open={props.open} TransitionComponent={Transition} onClose={props.handleClose}>
            <Config close={props.close} showHeader/>
        </Dialog>
    )
}

export default BackdroppedConfig;