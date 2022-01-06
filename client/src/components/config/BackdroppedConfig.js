import { React, useEffect, useState, forwardRef } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper, Dialog, Slide, Divider, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'

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