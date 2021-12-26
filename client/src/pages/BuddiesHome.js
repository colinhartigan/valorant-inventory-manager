import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import Header from '../components/misc/Header.js'
import Footer from '../components/misc/Footer.js'

import { socket } from "../services/Socket"; 

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({

    footer: {
        height: "25vh"
    },

    root: {
        height: "80vh",
        margin: "auto",
        display: "flex",
        padding: 0,
        flexGrow: 1,
    },
}));


function CollectionHome(props) {
    
    const classes = useStyles();
    const theme = useTheme();

    return (
        <>
            <Header />
            <Footer />
        </>
    ) 
}


export default CollectionHome