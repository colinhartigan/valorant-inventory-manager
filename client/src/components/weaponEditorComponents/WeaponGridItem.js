import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({

    weaponPaper: {
        width: "100%",
        height: "70px",
    }

}));

function Weapon(props){
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Paper variant="outlined" className={classes.weaponPaper}>
            {props.skinData.display_name}
            {/* 
            top right should have the skin tier icon
            skin image should take up as much space as possible
            do i want to add a skin name label?
            should have hover effect
            */}
        </Paper>
    )

}

export default Weapon;