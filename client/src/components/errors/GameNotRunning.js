import {React, useEffect, useState} from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Step, Stepper, StepLabel, Typography, Button, Grow, Backdrop, Paper } from '@mui/material'

//icons
import { Settings, Shuffle, Autorenew, TramRounded, ContactsOutlined } from '@mui/icons-material';

import socket from "../../services/Socket";


const useStyles = makeStyles((theme) => ({
    "@global": {
        "@keyframes spin": {
            "0%": {
                transform: "rotate(-360deg)"
            },
            "100%": {
                transform: "rotate(0deg)"
            }
        }
    },

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
        height: "200px",
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
    },

    loading: {
        animation: "spin 4s linear infinite",
    },

}));


function GameNotRunning(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [enableGameStartButton, setEnableGameStartButton] = useState(true);
    const [open, setOpen] = useState(true)

    function launch() {
        setEnableGameStartButton(false);
        socket.send({"request": "start_game"})
    }

    return (
        <Backdrop open className={classes.root}>
            <Grow in={open}>
                <div className={classes.main}>
                    <div className={classes.content}>
                        <Typography variant="h4">VALORANT not open</Typography>
                        <Typography variant="body1" style={{textAlign: "center", marginTop: "10px",}}>Couldn't detect VALORANT running on your computer.</Typography>

                        <div className={classes.buttons}> 
                            <Button variant="outlined" color="primary" onClick={launch} disabled={!enableGameStartButton} className={classes.retryButton}>
                                {enableGameStartButton ? "Launch VALORANT" : <Autorenew className={classes.loading}/>}

                            </Button>
                        </div>
                    </div>
                    
                </div>
            </Grow>
        </Backdrop>
    )
}

export default GameNotRunning