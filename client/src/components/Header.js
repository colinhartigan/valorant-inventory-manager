import React from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Grid, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core'

//icons
import {Settings, Shuffle} from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({

    appBar: {
        flexGrow: 1,
        marginBottom: "25px",
        display: "flex",
        flexDirection: "column",
        zIndex: 5,
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },

    action: {
        margin: "8px 0px 8px 0px"
    }

}));


function Header(props) {

    const classes = useStyles();

    return (
        <Slide direction="down" in>
            <AppBar className={classes.appBar} position="static" color="secondary">
                <Toolbar>
                    <Typography variant="h6" color="primary" style={{flexGrow: 1}}>VSM</Typography>

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
            </AppBar>
        </Slide>
    )
}

export default Header