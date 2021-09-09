import {React, useEffect, useState} from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Grid, Container, Typography, Paper, Fade } from '@material-ui/core'

const stockImageSize = "250px";
const scaleOverrides = {
    "29a0cfab-485b-f5d5-779a-b59f85e204a8": "120px", //classic
    "42da8ccc-40d5-affc-beec-15aa47b42eda": "155px", //shorty
    "44d4e95c-4157-0037-81b2-17841bf2e8e3": "105px", //frenzy
    "1baa85b4-4c70-1284-64bb-6481dfc3bb4e": "155px", //ghost
    "e336c6b8-418d-9340-d77f-7a9e4cfe0702": "145px", //sheriff

    "f7e1b454-4ad4-1063-ec0a-159e56b58941": "190px", //stinger
    "462080d1-4035-2937-7c09-27aa2a5c27a7": "200px", //spectre

    "ae3de142-4d85-2547-dd26-4e90bed35cf7": "240px", //bulldog

    "55d8a0f4-4274-ca67-fe2c-06ab45efdf58": "260px", //ares
    "63e6c2b6-4a8e-869c-3d4c-e38355226584": "270px", //odin

    "2f59173c-4bed-b6c3-2191-dea9b58be9c7": "165px", //melee
}

const useStyles = makeStyles((theme) => ({

    weaponContainerVideo: {
        position: "absolute",
        objectFit: "cover",
        width: "auto",
        height: "auto",
    },

    weaponPaper: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "0.1s ease-out !important",
        "&:hover": {
            border: `1px ${theme.palette.primary.main} solid`
        },
    },

    textGrid: {
        display: "flex",
        textAlign: "left",
        width: "90%",
        alignSelf: "flex-end"
    },

    weaponLabel: {
        display: "flex",
        textAlign: "left",
        width: "90%",
        height: "auto",
        alignSelf: "flex-end"
    }

}));


function HoverVideo(props) {
    return (
        <div style={{ position: "absolute", objectFit: "fill", }}>
            <video width="256px" height="96px" autoplay muted loop>
                <source src="https://media.valorant-api.com/streamedvideos/release-03.04/72c8af91-f9f9-4044-801c-3e73ee2f2aa1.mp4" type="video/mp4" />
            </video>
        </div>
    );
}

function Weapon(props) {

    const classes = useStyles();

    var db = false;
    const [isUpdating, setUpdate] = useState(true);
    const [skinData, updateSkinData] = useState({});

    useEffect(() => {
        if (props.data !== undefined) {
            var comparisonTarget = skinData !== null ? skinData.chroma_uuid : ""
            console.log(comparisonTarget)
            if (db === false && props.data.chroma_uuid !== comparisonTarget) {
                db = true
                setTimeout(() => {
                    setUpdate(true);
                    setTimeout(() => {
                        updateSkinData(props.data);
                        setTimeout(() => {
                            setUpdate(false);
                            db = false;
                        }, randomTimer());
                    }, randomTimer())
                }, randomTimer());
            }
        }
     }, [props.data]);


    const randomTimer = () => {
        return ((Math.random() * 300) + 100);
    }

    return (
        <Fade in={!isUpdating}>
            <Paper className={classes.weaponPaper} variant="outlined" style={{ backgroundImage: skinData != {} ? `url(${skinData.image})` : `url("https://media.valorant-api.com/weapons/${props.uuid}/displayicon.png")`, backgroundSize: `${props.uuid in scaleOverrides ? scaleOverrides[props.uuid] : stockImageSize} auto` }}>
                <Typography className={classes.weaponLabel} variant="overline">{props.displayName}</Typography>
            </Paper>
        </Fade>
    )

}

export default Weapon