import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Backdrop, Paper, Grid, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: -1,
    },

    root: {
        width: "45%",
        height: "70%",
        marginTop: "100px",
        margin: "auto",
        display: "flex",
    },

    mainGrid: {
        width: "90%",
        height: "95%",
        position: "relative",
        margin: "auto",
        marginTop: "10px",
    },

    showcaseWindow: {
        width: "100%",
        height: "20%",
        display: "flex",

    },

}));


function WeaponEditor(props) {

    const classes = useStyles();

    return (
        <Backdrop in className={classes.backdrop}>
            <Paper className={classes.root}>
                <Grid container className={classes.mainGrid} spacing={2} direction="column">
                    <Grid item className={classes.showcaseWindow}>
                        <img src="https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png" style={{width:"auto", height: "80%", alignSelf: "center", marginRight: "10px",}}/>
                        <div style={{display: "flex", flexDirection: "column"}} lineHeight={2}>
                            <Typography style={{minWidth: "50%", flexGrow: 1, alignSelf: "center"}} variant="h5">
                                Prime//2.0 Karambit
                            </Typography>
                            <Typography variant="overline"> 
                                MELEE
                            </Typography>
                        </div>
                        
                    </Grid>
                    <Grid item>
                        
                    </Grid>
                </Grid>
            </Paper>
        </Backdrop>
    )
}

export default WeaponEditor