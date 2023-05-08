import {React, useEffect, useState} from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Step, Stepper, StepLabel, Typography, Button, Grow, Backdrop, Paper } from '@mui/material'

//icons
import { Settings, Shuffle, Autorenew } from '@mui/icons-material';

import { Config, ServerVersion } from "../../services/ClientConfig";


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
    }

}));


function WrongVersion(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [newVersion, setNewVersion] = useState("");

    useEffect(() => {
        fetch("https://api.github.com/repos/colinhartigan/valorant-inventory-manager/releases")
            .then(res => res.json())
            .then((dat) => {
                var data = dat[0]; 
                console.log(data)
                setNewVersion(data.tag_name);
            })
    }, [])

    return (
        <Backdrop open className={classes.root}>
            <Grow in>
                <div className={classes.main}>
                    <div className={classes.content}>
                        <Typography variant="h4" style={{textAlign: "center"}}>Client Companion version mismatch</Typography>
                        <Typography variant="body1" style={{textAlign: "center", marginTop: "10px", marginBottom: "10px"}}>Your VIM client companion version is not supported. ({ServerVersion} {'→'} {newVersion})</Typography>

                        <div className={classes.buttons}> 
                            <Button target="_blank" href="https://github.com/colinhartigan/valorant-inventory-manager/releases/latest" variant="outlined" color="primary" className={classes.retryButton}>
                                View latest release 
                            </Button>
                        </div>
                    </div>
                    
                </div>
            </Grow>
        </Backdrop>
    )
}

export default WrongVersion