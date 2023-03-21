import {React, useEffect, useState} from 'react';

import makeStyles from '@mui/styles/makeStyles';

//components
import {
    Backdrop,
    CircularProgress,
    Typography,
    Box,
    Container,
    ThemeProvider,
    StyledEngineProvider,
} from '@mui/material';

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
                <CircularProgress color="primary"/>
            </Box>
        </Backdrop>
    )
}

export default WebsocketHandshake