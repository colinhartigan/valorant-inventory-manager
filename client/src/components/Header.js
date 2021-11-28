import React from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Grid, Container, Typography, Toolbar, IconButton, Slide, Paper } from '@material-ui/core'

//icons
import {Settings, Shuffle} from '@material-ui/icons';


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

    return (
        <Slide direction="down" in>
            <Paper variant="outlined" className={classes.appBar} position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                        a creative title
                    </Typography>

                    <div className={classes.actions}>

                        {/* shuffle */}
                        <IconButton
                            aria-label="account button lol"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            edge="end"
                            // onClick={}
                            color="inherit"
                            className={classes.action}
                        >
                            <Shuffle />
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