import React from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grid, CircularProgress, Typography, Toolbar, IconButton, Slide, Paper } from '@material-ui/core'

//icons
import { Settings, Shuffle, Autorenew } from '@material-ui/icons';

import { request } from "../services/Socket";


const useStyles = makeStyles((theme) => ({

    appBar: {
        flexGrow: 1,
        margin: "12px",
        display: "flex",
        flexDirection: "column",
        zIndex: 5,
        backgroundColor: "rgba(0, 0, 0, 0)",
        border: "0px rgb(255,255,255) solid",
        borderRadius: "15px",
    },

    action: {
        width: "40px",
        height: "40px",
        margin: theme.spacing(.25),
    }

}));


function Header(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [randomizing, setRandomizing] = React.useState(false);

    async function randomize() {
        setRandomizing(true);
        await request({ "request": "randomize_skins" })
            .then(data => {
                setRandomizing(false);
                props.setLoadout(data.response);
            });
        setTimeout(() => {
            setRandomizing(false);
        }, 3000);
    }

    return (
        <Slide direction="down" in>
            <Paper variant="outlined" className={classes.appBar} position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        a creative title
                    </Typography>

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
                            {randomizing ? <Autorenew /> : <Shuffle />}
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
                        >
                            <Settings />
                        </IconButton>

                        {/* add a menu here for settings and stuff */}
                    </div>
                </Toolbar>
            </Paper>
        </Slide>
    )
}

export default Header