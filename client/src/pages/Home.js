import { React, useEffect, useState } from 'react';
import Loader from "react-loader-spinner";

//utilities
import { withStyles } from '@material-ui/core/styles';

//components
import Collection from '../components/Collection.js'
import { Grid, Container, Typography } from '@material-ui/core'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const styles = theme => ({
    header: {
        display: "flex",
        width: "100%",
    },
    headerText: {
        fontFamily: "tungsten-bold",
        fontSize: "4em",
        opacity: "0.25",
    },
    footer: {
        height: "25vh"
    },
    root: {
        userSelect: "none",
        display: "flex"
    },
});


function Home(props) {
    const { classes } = props;
    useEffect(() => {
        document.title = "valorant-skin-manager / home"
    }, []);

    return (
        <>
            <Container className={classes.header}>
                <h1 className={classes.headerText}>VALORANT SKIN MANAGER</h1>
            </Container>
            <Container className={classes.root} alignItems="center">
                <Collection />
            </Container>
        </>
    )
}


export default withStyles(styles)(Home)