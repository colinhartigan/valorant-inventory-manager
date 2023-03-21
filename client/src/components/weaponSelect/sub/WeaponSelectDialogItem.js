import { React, useEffect, useState } from 'react';
import clsx from  'clsx';

//utilities
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useWindowDimensions from '../../../services/useWindowDimensions.js';

//components
import { Grid, Grow, Typography, Paper, Fade, Collapse } from '@mui/material'

const stockImageSize = "250px";

const weaponImageScales = {
    "29a0cfab-485b-f5d5-779a-b59f85e204a8": ["60% auto", "auto 60%"], //classic
    "42da8ccc-40d5-affc-beec-15aa47b42eda": ["75% auto", "auto 35%"], //shorty
    "44d4e95c-4157-0037-81b2-17841bf2e8e3": ["55% auto", "auto 60%"], //frenzy
    "1baa85b4-4c70-1284-64bb-6481dfc3bb4e": ["75% auto", "auto 45%"], //ghost
    "e336c6b8-418d-9340-d77f-7a9e4cfe0702": ["75% auto", "auto 60%"], //sheriff

    "f7e1b454-4ad4-1063-ec0a-159e56b58941": ["70% auto", "auto 65%"], //stinger
    "462080d1-4035-2937-7c09-27aa2a5c27a7": ["75% auto", "auto 65%"], //spectre

    "910be174-449b-c412-ab22-d0873436b21b": ["88% auto", "auto 40%"], //bucky
    "ec845bf4-4f79-ddda-a3da-0db3774b2794": ["90% auto", "auto 60%"], //judge

    "ae3de142-4d85-2547-dd26-4e90bed35cf7": ["80% auto", "auto 65%"], //bulldog
    "4ade7faa-4cf1-8376-95ef-39884480959b": ["90% auto", "auto 50%"], //guardian
    "ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a": ["90% auto", "auto 55%"], //phantom
    "9c82e19d-4575-0200-1a81-3eacf00cf872": ["90% auto", "auto 70%"], //vandal

    "c4883e50-4494-202c-3ec3-6b8a9284f00b": ["90% auto", "auto 42%"], //marshal
    "a03b24d3-4319-996d-0f8c-94bbfba1dfc7": ["90% auto", "auto 50%"], //operator

    "55d8a0f4-4274-ca67-fe2c-06ab45efdf58": ["90% auto", "auto 45%"], //ares
    "63e6c2b6-4a8e-869c-3d4c-e38355226584": ["95% auto", "auto 60%"], //odin

    "2f59173c-4bed-b6c3-2191-dea9b58be9c7": ["auto 70%", "auto 70%"], //melee
}

const useStyles = makeStyles((theme) => ({

    weaponPaper: {
        flexDirection: "row",
        position: "relative",
        width: "100%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        transition: ".25s ease !important",
    },

    weaponPaperHover: {
        "&:hover": {
            border: `1px ${theme.palette.primary.main} solid`,
        },
    },

    weaponImage: {
        zIndex: 1,
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        background: "transparent",
        // transition: ".25s ease !important",
        backfaceVisibility: "hidden",
    },

}));


function WeaponSelectDialogItem(props) {

    const classes = useStyles();
    const theme = useTheme();

    const callback = props.callback

    const skinData = props.data
    const skinUuid = skinData.skin_uuid
    const weaponUuid = props.weaponUuid
    const disable = props.disable

    return (
        <Paper
            className={clsx(classes.weaponPaper, (!disable ? classes.weaponPaperHover : null))}
            variant="outlined"
            onMouseEnter={null}
            onMouseLeave={null}
            onClick={() => {if(!disable){callback(weaponUuid)}}}
            style={{ }}
            disabled={disable}
        >
            <div
                className={classes.weaponImage}
                style={{
                    //backgroundPosition: props.uuid === "2f59173c-4bed-b6c3-2191-dea9b58be9c7" ? "50% 35%" : (!props.useLargeWeaponImage ? "50% 40%" : "50% 50%"), 
                    backgroundPosition: "50% 50%",
                    backgroundImage: `url(${skinData.skin_image})`,
                    backgroundSize: weaponImageScales[weaponUuid][0],
                    //props.uuid !== "2f59173c-4bed-b6c3-2191-dea9b58be9c7" ? (!props.useLargeWeaponImage ? `${props.uuid in weaponImageScales ? weaponImageScales[props.uuid][0] : stockImageSize} auto` : `calc(${weaponImageScales[props.uuid][0]} + ${weaponImageScales[props.uuid][1]}) auto`) : "auto 80%",
                }}
            />

        </Paper>
    )

}

export default WeaponSelectDialogItem