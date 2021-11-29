import {React, useEffect, useState} from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Backdrop, CircularProgress, Typography, Box, Container, ThemeProvider } from '@material-ui/core'

//icons


const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    }

}));


function WebsocketHandshake(props) {

    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={props.open}>
            <Box>
                <CircularProgress color="#ffffff"/>
            </Box>
        </Backdrop>
    )
}

export default WebsocketHandshake