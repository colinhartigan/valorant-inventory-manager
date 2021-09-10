import React from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Grid, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core'

//icons
import SettingsIcon from '@material-ui/icons/Settings';


const useStyles = makeStyles((theme) => ({

    appBar: {
        flexGrow: 1,
        marginBottom: "25px",
        display: "flex",
        flexDirection: "column",
    },

    menuButton: {
        marginRight: theme.spacing(2),
    }

}));


function WeaponEditor(props) {

    const classes = useStyles();

    return (
        <>
        </>
    )
}

export default WeaponEditor