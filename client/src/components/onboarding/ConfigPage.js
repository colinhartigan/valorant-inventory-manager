

import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { List, ListItem, ListItemText, Typography, Divider, Button, Container, Paper } from '@mui/material'
import Config from "../config/Config.js"

import socket from "../../services/Socket";
import useLocalStorage from '../../services/useLocalStorage.js';

const useStyles = makeStyles((theme) => ({



    buttonDiv: {
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "5px",
        justifyContent: "flex-end",
    },

    nextButton: {
        width: "90%",
        height: "37px",
        marginBottom: "15px",
    }
}));


function ConfigPage(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [done, setDone] = useState(false)
    const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage("onboardingCompleted");

    useEffect(() => {
        console.log(onboardingCompleted)
    }, [])

    const style = props.pageStyle

    function finish(){
        setDone(true)
        setOnboardingCompleted(true);
        props.nextCallback()
    }

    return (
        <div style={{ ...style, width: "100%", }}>
            <div style={{ height: "68%", padding: "0px 0px 10px 0px" }}>
                <Config saveTrigger={done}/>
            </div>


            <div className={classes.buttonDiv}>
                <Button variant="outlined" color="primary" onClick={finish} className={classes.nextButton}>
                    Finish
                </Button>
            </div>
        </div>
    )
}

export default ConfigPage