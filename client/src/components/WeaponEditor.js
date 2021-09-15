import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Backdrop, Paper, Grid, Typography, Container, IconButton, Slide, AppBar } from '@material-ui/core';

import LevelSelector from './weaponEditorComponents/LevelSelector';
import ChromaSelector from './weaponEditorComponents/ChromaSelector'


const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: 3,
    },

    masterGrid: {
        display: "flex",
        margin: "auto",
        height: "100%",
        width: "100%",
    },

    mainPaper: {
        margin: "auto",
        width: "100%",
        height: "80vh",
        //height: "90vh",
        display: "flex",
        justifySelf: "flex-start",
        justifyContent: "center",
        alignContent: "flex-start",
        flexWrap: "wrap",
        overflow: "auto",
    },


    // stuff like skin name, weapon name, skin image
    paperOnTopContent: {
        width: "90%",
        display: "flex",
        flexDirection: "column",
    },

    mainSkinImage: {
        width: "auto",
        height: "100px",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        paddingTop: "10px",
        paddingBottom: "10px",
        marginTop: "10px",
    },

    currentlyEquipped: {
        width: "auto",
        display: "flex",
        marginTop: "20px",
        flexWrap: "wrap",
    },


    //container for subcomponents
    paperCustomizingContent: {
        width: "90%",
        height: "auto",
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
    },

    levelSelectors: {
        height: "45px",
        display: "flex",
        flexDirection: "row",
        width: "100%"
    }

}));


function WeaponEditor(props) {

    const classes = useStyles();

    return (
        <Backdrop in className={classes.backdrop}>
            <Grid container className={classes.masterGrid} direction="row" justifyContent="center" alignItems="center">
                <Grid item xl={3} lg={4} md={6} sm={9} xs={12} style={{ display: "flex", marginTop: "10px" }}>
                    <Paper className={classes.mainPaper}>
                        <div className={classes.paperOnTopContent}>

                            <div className={classes.currentlyEquipped}>
                                <div style={{ width: "auto", alignSelf: "center" }}>
                                    <img src="https://media.valorant-api.com/contenttiers/e046854e-406c-37f4-6607-19a9ba8426fc/displayicon.png" style={{ width: "auto", height: "40px", justifySelf: "center", marginRight: "10px" }} />
                                </div>

                                <div>
                                    <Typography variant="h5">
                                        Spectrum Phantom
                                    </Typography>
                                    <Typography variant="overline">
                                        PHANTOM
                                    </Typography>
                                </div>

                            </div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>

                                <Paper variant="outlined" outlinecolor="secondary" className={classes.mainSkinImage}>
                                    <img src="https://media.valorant-api.com/weaponskinchromas/e924a97d-46aa-3c3e-ec39-9abfeb811f2b/fullrender.png" style={{ width: "auto", height: "100%" }} />
                                </Paper>
                            </div>

                        </div>


                        <div className={classes.paperCustomizingContent}>

                            <div className={classes.levelSelectors}>
                                <LevelSelector />
                                <ChromaSelector />
                            </div>

                            <div className={classes.skinGrid}> 
                                
                            </div>
                            

                        </div>


                    </Paper>
                </Grid>
            </Grid>
        </Backdrop>
    )
}

export default WeaponEditor