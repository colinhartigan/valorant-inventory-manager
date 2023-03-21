

import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Collapse, Button, Grow, Fade, Paper } from '@mui/material'

import { Place, Public, Person, Autorenew } from '@mui/icons-material';

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

    start: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },

    gameNotRunning: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },

    autodetectClient: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },

    accountDataList: {
        flexGrow: 0,
        marginBottom: "5px",
    },

    loading: {
        animation: "spin 4s linear infinite",
    },

    buttons: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "flex-end",
    },

    nextButton: {
        width: "100%",
        height: "37px",
        marginBottom: "15px",
    }

}));


function AccountPage(props) {

    const classes = useStyles();
    const theme = useTheme();

    const style = props.pageStyle

    const [gameRunning, setGameRunning] = useState(false)
    const [enableGameStartButton, setEnableGameStartButton] = useState(true)
    const [ready, setReady] = useState(false)

    const [accountRetrieved, setaccountRetrieved] = useState(false)
    const [accountData, setAccountData] = useState({})

    function startGame() {
        function launchCallback(response) {
            if (response === true) {
                setGameRunning(true);
            }
        }
        socket.request({ "request": "start_game" }, launchCallback)
    }

    function autodetectAccount() {
        function accountCallback(response){
            setaccountRetrieved(true);
            setAccountData(response)
        }
        socket.request({ "request": "autodetect_account" }, accountCallback)
    }

    function isGameRunning() {
        function gameRunningCallback(response){
            setGameRunning(response)
            setReady(true)
        }
        socket.request({ "request": "get_running_state" }, gameRunningCallback)
    }

    useEffect(() => {
        if (!ready) {
            isGameRunning();
        }
    }, [])

    useEffect(() => {
        if (gameRunning && !accountRetrieved) {
            autodetectAccount();
        }
    }, [gameRunning])

    return (
        <div style={style}>

            <div className={classes.start}>
                <Typography variant="h4">Let's get started</Typography>

                <Fade in={!gameRunning && ready} unmountOnExit mountOnEnter>
                    <div className={classes.gameNotRunning}>
                        <Typography style={{ marginTop: "12px", marginBottom: "10px" }} variant="body2">It looks like VALORANT isn't open. VALORANT needs to be open to set up VIM.</Typography>
                        <Button variant="outlined" color="primary" disabled={!enableGameStartButton} className={classes.startButton} onClick={startGame}>
                            {enableGameStartButton ? "Launch VALORANT" : <Autorenew className={classes.loading} />}
                        </Button>
                    </div>
                </Fade>

                <Fade in={gameRunning} style={{ transitionDelay: "200ms" }} unmountOnExit mountOnEnter>
                    <div className={classes.autodetectClient}>
                        <Typography style={{ marginTop: "12px", marginBottom: "5px" }} variant="body2">{accountRetrieved ? "Discovered the following account data:" : "Attempting to autodetect your VALORANT account."}</Typography>

                        <Fade in={accountRetrieved} mountOnEnter unmountOnExit>
                            <List className={classes.accountDataList}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Person color="action"/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${accountData.game_name}#${accountData.game_tag}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Place color="action"/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`Region: ${accountData.region}`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Public color="action"/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`Shard: ${accountData.shard}`} />
                                </ListItem>
                            </List>
                        </Fade>

                        <Fade in={accountRetrieved} style={{ transitionDelay: "500ms" }} mountOnEnter unmountOnExit>
                            <div className={classes.buttons}>
                                <Button variant="outlined" color="primary" onClick={props.nextCallback} className={classes.nextButton}>
                                    Next
                                </Button>
                            </div>
                        </Fade>

                    </div>
                </Fade>

            </div>

        </div>
    )
}

export default AccountPage