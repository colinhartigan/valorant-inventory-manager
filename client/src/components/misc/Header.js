import React, { useEffect } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grid, Grow, Typography, Toolbar, IconButton, Slide, Paper, Tooltip } from '@material-ui/core'

//icons
import { Settings, Shuffle, Autorenew, SportsEsports } from '@material-ui/icons';

import socket from "../../services/Socket";
import BackdroppedConfig from "../config/BackdroppedConfig.js"


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

    appBar: {
        margin: "12px",
        display: "flex",
        flexDirection: "column",
        height: "50px",
        zIndex: 2,
        backgroundColor: "rgba(0, 0, 0, 0)",
        border: "0px rgb(255,255,255) solid",
    },

    statusBar: {
        alignSelf: "center",
        justifySelf: "center",
        display: "flex",
        marginRight: theme.spacing(1),
        flexGrow: 1,
    },

    inGameIndicator: {
        alignSelf: "center",
        color: "#9de069",
    },

    action: {
        width: "40px",
        height: "40px",
        margin: theme.spacing(.25),
    },

    loading: {
        animation: "spin 4s linear infinite",
    },

}));


function Header(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [randomizing, setRandomizing] = React.useState(false);
    const [inGame, setInGame] = React.useState(false);

    const [openSettings, setOpenSettings] = React.useState(false);

    useEffect(() => {
        function ingameCallback(response){
            setInGame(response.state)
        }
        socket.subscribe("game_state",ingameCallback)
    }, [])

    async function randomize() {
        setRandomizing(true);
        // setTimeout(() => {
        //     setRandomizing(false);
        // }, 3000);
        function callback(response) {
            setRandomizing(false);
        }
        
        socket.request({ "request": "randomize_skins" }, callback);
    }

    // socket.onmessage = async (event) => {
    //     const response = JSON.parse(event.data);
    //     console.log(response)
    //     if (response.event === "game_state") {
    //         if (response.data.state === true) {
    //             setInGame(true);
    //         } else {
    //             setInGame(false);
    //         }
    //     }
    // }


    return (
        <>
            <BackdroppedConfig open={openSettings} close={setOpenSettings}/>
            <Slide direction="down" in>
                <Paper variant="outlined" className={classes.appBar} position="static">
                    <Toolbar style={{height: "100%", width: "100%",}}>

                        <Typography variant="h6" style={{ flexGrow: 0, marginRight: theme.spacing(2) }}>
                            placeholder title
                        </Typography>

                        <div className={classes.statusBar}>
                            <Grow in={inGame}>
                                <Tooltip title="In game">
                                    <SportsEsports className={classes.inGameIndicator} />
                                </Tooltip>
                            </Grow>

                        </div>

                        <div className={classes.actions}>

                            {/* shuffle */}
                            <IconButton
                                aria-label="randomize"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                edge="end"
                                onClick={randomizing ? null : randomize}
                                color="inherit"
                                className={classes.action}
                            >
                                {randomizing ? <Autorenew className={classes.loading} /> : <Shuffle />}
                            </IconButton>

                            {/* settings/account */}
                            <IconButton
                                aria-label="account button lol"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                edge="end"
                                // onClick={}
                                color="inherit"
                                className={classes.action}
                                onClick={() => setOpenSettings(true)}
                            >
                                <Settings/>
                            </IconButton>

                            {/* add a menu here for settings and stuff */}
                        </div>
                    </Toolbar>
                </Paper>
            </Slide>
        </>
    )
}

export default Header