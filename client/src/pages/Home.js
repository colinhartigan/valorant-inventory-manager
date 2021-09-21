import { React, useEffect, useState } from 'react';
import Loader from "react-loader-spinner";

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import Header from '../components/Header.js'
import WeaponEditor from '../components/WeaponEditor.js'
import Collection from '../components/Collection.js'

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

    footer: {
        height: "25vh"
    },

    root: {
        margin: "auto",
        display: "flex",
        padding: 0,
    },
}));


function Home(props) {
    
    const classes = useStyles();

    useEffect(() => {
        document.title = "valorant-skin-manager / home"
    }, []);

    function skinMenu(id){

    }

    return (
        <>
            <Header />
            <Container maxWidth="xl" className={classes.root}>
                {/* <WeaponEditor /> */}
                <Collection skinMenuCallback={skinMenu}/>
            </Container>
        </>
    )
}


export default Home