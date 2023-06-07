import React, { useEffect } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Grid, Grow, Typography, Toolbar, IconButton, Slide, Paper, Tooltip } from '@mui/material'

//icons
import { Settings, Shuffle, Autorenew, SportsEsports } from '@mui/icons-material';

import BackdroppedConfig from "../config/BackdroppedConfig.js"

import socket from "../../services/Socket";
import useKeyboardListener from '../../services/useKeyboardListener.js';
import { useLoadout } from '../../services/useLoadout.js';


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
    const [refreshing, setRefreshing] = React.useState(false);
    const [inGame, setInGame] = React.useState(false);

    const [openSettings, setOpenSettings] = React.useState(false);
    const [keysDown] = useKeyboardListener();

    const [loadout, setLoadout] = useLoadout();

    useEffect(() => {
        function ingameCallback(response) {
            setInGame(response.state)
        }
        socket.subscribe("game_state", ingameCallback)
        socket.send({ "request": "force_update_game_state" })
    }, [])

    useEffect(() => {
        switch (keysDown.join(' ')) {
            case "r":
                randomize(true, true);
                break;

            case "s":
                randomize(true, false);
                break;

            case "b":
                randomize(false, true);
                break;

            default:
                break;
        }

    }, [keysDown])

    async function randomize(skins, buddies) {
        setRandomizing(true);
        function callback(response) {
            setRandomizing(false);
        }

        if (skins) {
            socket.request({ "request": "randomize_skins" }, callback);
        }
        if (buddies) {
            socket.request({ "request": "randomize_buddies" }, callback);
        }
    }

    function refresh() {
        setRefreshing(true)
        function callback(response) {
            setRefreshing(false)
            setLoadout(response)
        }

        socket.request({ "request": "fetch_loadout" }, callback)
    }


    return <>
        <BackdroppedConfig open={openSettings} close={setOpenSettings} />
        <Slide direction="down" in>
            <Paper variant="outlined" className={classes.appBar} position="static">
                <Toolbar style={{ height: "100%", width: "100%", }}>

                    <Typography variant="h5" style={{ flexGrow: 0, marginRight: theme.spacing(2) }}>
                        VIM
                    </Typography>

                    <div className={classes.statusBar}>
                        <Grow in={inGame}>
                            <Tooltip title="In game">
                                <SportsEsports className={classes.inGameIndicator} />
                            </Tooltip>
                        </Grow>
                    </div>

                    <div className={classes.actions}>

                        {/* refresh */}
                        <Tooltip title="Refresh loadout (if you make changes in game)">
                            <IconButton
                                aria-label="randomize"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                edge="end"
                                onClick={refreshing ? null : refresh}
                                color="inherit"
                                className={classes.action}
                                size="medium"
                            >
                                {refreshing ? <Autorenew className={classes.loading} /> : <Autorenew />}
                            </IconButton>
                        </Tooltip>

                        {/* shuffle */}
                        <Tooltip title="Randomize skins and buddies">
                            <IconButton
                                aria-label="randomize"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                edge="end"
                                onClick={randomizing ? null : randomize}
                                color="inherit"
                                className={classes.action}
                                size="medium"
                            >
                                {randomizing ? <Autorenew className={classes.loading} /> : <Shuffle />}
                            </IconButton>
                        </Tooltip>

                        {/* settings */}
                        <Tooltip title="Settings">
                            <IconButton
                                aria-label="settings button lol"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                edge="end"
                                // onClick={}
                                color="inherit"
                                className={classes.action}
                                onClick={() => setOpenSettings(true)}
                                size="large">
                                <Settings />
                            </IconButton>
                        </Tooltip>

                    </div>
                </Toolbar>
            </Paper>
        </Slide>
    </>;
}

export default Header