import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import Header from '../components/misc/Header.js'
import Footer from '../components/misc/Footer.js'

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        width: "100%",
        height: "75px",
        margin: "0px 20px 10px 20px",
        paddingTop: "0px",
        zIndex: 3,
    },
}));


function About(props) {

    const classes = useStyles();
    const theme = useTheme();


    useEffect(() => {
        document.title = "VIM // About"
    }, []);

    return (
        <>
            <div style={{ height: "100%", width: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1 }}>
                <Container maxWidth={"lg"} style={{ width: "100%", height: "100%", display: "flex", flexGrow: 1, flexDirection: "column", }}>

                    <div className={classes.header}>
                        <Typography variant="h4" style={{ color: theme.palette.primary.light, fontSize: "2.2rem", flexGrow: 1, margin: "auto" }}>About VIM</Typography>
                    </div>

                </Container>
            </div>
        </>
    )
}


export default About