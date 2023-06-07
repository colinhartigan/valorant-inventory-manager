import {React, useEffect, useState} from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Step, Stepper, StepLabel, Typography, Button, Grow, Backdrop, Paper } from '@mui/material'

//icons
import { Settings, Shuffle, Autorenew } from '@mui/icons-material';


const useStyles = makeStyles((theme) => ({
    root: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
        zIndex: 100,
    },

    main: {
        width: "400px",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    content: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "center",
    },

    retryButton: {
        alignSelf: "center",
        height: "45px",
        width: "80%",
    },

    buttons: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        flexGrow: 0,
        justifyContent: "center",
        marginTop: "15px",
    }

}));


function ConnectionFailed(props) {

    const classes = useStyles();
    const theme = useTheme();

    return (
        <Backdrop open className={classes.root}>
            <Grow in>
                <div className={classes.main}>
                    <div className={classes.content}>
                        <Typography variant="h4">Connection failed</Typography>
                        <Typography variant="body1" style={{textAlign: "center", marginTop: "10px",}}>Couldn't connect to your computer. Is the VIM client companion running?</Typography>

                        <div className={classes.buttons}> 
                            <Button variant="outlined" color="primary" onClick={props.retry} className={classes.retryButton}>
                                Retry
                            </Button>
                            <Button target="_blank" href="https://github.com/colinhartigan/valorant-inventory-manager" variant="outlined" color="primary" className={classes.retryButton} style={{marginTop: "15px", height: "35px"}}>
                                Github
                            </Button>
                        </div>
                    </div>
                    
                </div>
            </Grow>
        </Backdrop>
    )
}

export default ConnectionFailed