import { React, useEffect, useState } from 'react';
import Loader from "react-loader-spinner";

//utilities
import { withStyles } from '@material-ui/core/styles';

//components
import Collection from '../components/Collection.js'
import Header from '../components/Header.js'

import { Grid, Container, Typography } from '@material-ui/core'

const styles = theme => ({

    footer: {
        height: "25vh"
    },

    root: {
        margin: "auto",
        display: "flex",
        flexGrow: 1,
    },
});


function Home(props) {
    const { classes } = props;
    useEffect(() => {
        document.title = "valorant-skin-manager / home"
    }, []);

    return (
        <>
            <Header />
            <Container maxWidth="lg" className={classes.root}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid item xs />
                    <Grid item xs={12}>
                        <Collection />
                    </Grid>
                    <Grid item xs />
                </Grid>
            </Container>
        </>
    )
}


export default withStyles(styles)(Home)