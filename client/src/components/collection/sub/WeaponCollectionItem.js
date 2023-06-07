import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useWindowDimensions from '../../../services/useWindowDimensions.js';

//components
import { Grid, Grow, Typography, Paper, Fade, Collapse, Tooltip } from '@mui/material'

const stockImageSize = "250px";

const backup = { //unused backups which had true sizing instead of scaling with percentages
    //fisrt num = base width, second num == number to add for larger width
    "29a0cfab-485b-f5d5-779a-b59f85e204a8": ["100px", "20px"], //classic
    "42da8ccc-40d5-affc-beec-15aa47b42eda": ["130px", "30px"], //shorty
    "44d4e95c-4157-0037-81b2-17841bf2e8e3": ["100px", "10px"], //frenzy
    "1baa85b4-4c70-1284-64bb-6481dfc3bb4e": ["140px", "35px"], //ghost
    "e336c6b8-418d-9340-d77f-7a9e4cfe0702": ["140px", "20px"], //sheriff

    "f7e1b454-4ad4-1063-ec0a-159e56b58941": ["195px", "20px"], //stinger
    "462080d1-4035-2937-7c09-27aa2a5c27a7": ["200px", "20px"], //spectre

    "910be174-449b-c412-ab22-d0873436b21b": ["240px", "40px"], //bucky
    "ec845bf4-4f79-ddda-a3da-0db3774b2794": ["240px", "30px"], //judge

    "ae3de142-4d85-2547-dd26-4e90bed35cf7": ["240px", "20px"], //bulldog
    "4ade7faa-4cf1-8376-95ef-39884480959b": ["240px", "60px"], //guardian
    "ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a": ["250px", "30px"], //phantom
    "9c82e19d-4575-0200-1a81-3eacf00cf872": ["240px", "30px"], //vandal

    "c4883e50-4494-202c-3ec3-6b8a9284f00b": ["250px", "70px"], //marshal
    "a03b24d3-4319-996d-0f8c-94bbfba1dfc7": ["240px", "100px"], //operator

    "55d8a0f4-4274-ca67-fe2c-06ab45efdf58": ["260px", "80px"], //ares
    "63e6c2b6-4a8e-869c-3d4c-e38355226584": ["270px", "40px"], //odin

    "2f59173c-4bed-b6c3-2191-dea9b58be9c7": ["auto", "20px"], //melee
}

const weaponImageScales = {
    "29a0cfab-485b-f5d5-779a-b59f85e204a8": ["45% auto", "auto 60%"], //classic
    "42da8ccc-40d5-affc-beec-15aa47b42eda": ["60% auto", "auto 35%"], //shorty
    "44d4e95c-4157-0037-81b2-17841bf2e8e3": ["45% auto", "auto 60%"], //frenzy
    "1baa85b4-4c70-1284-64bb-6481dfc3bb4e": ["65% auto", "auto 45%"], //ghost
    "e336c6b8-418d-9340-d77f-7a9e4cfe0702": ["60% auto", "auto 60%"], //sheriff

    "f7e1b454-4ad4-1063-ec0a-159e56b58941": ["52% auto", "auto 65%"], //stinger
    "462080d1-4035-2937-7c09-27aa2a5c27a7": ["55% auto", "auto 65%"], //spectre

    "910be174-449b-c412-ab22-d0873436b21b": ["75% auto", "auto 40%"], //bucky
    "ec845bf4-4f79-ddda-a3da-0db3774b2794": ["65% auto", "auto 60%"], //judge

    "ae3de142-4d85-2547-dd26-4e90bed35cf7": ["65% auto", "auto 63%"], //bulldog
    "4ade7faa-4cf1-8376-95ef-39884480959b": ["75% auto", "auto 50%"], //guardian
    "ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a": ["73% auto", "auto 55%"], //phantom
    "9c82e19d-4575-0200-1a81-3eacf00cf872": ["65% auto", "auto 70%"], //vandal

    "c4883e50-4494-202c-3ec3-6b8a9284f00b": ["80% auto", "auto 50%"], //marshal
    "a03b24d3-4319-996d-0f8c-94bbfba1dfc7": ["80% auto", "auto 55%"], //operator

    "55d8a0f4-4274-ca67-fe2c-06ab45efdf58": ["80% auto", "auto 47%"], //ares
    "63e6c2b6-4a8e-869c-3d4c-e38355226584": ["80% auto", "auto 60%"], //odin

    "2f59173c-4bed-b6c3-2191-dea9b58be9c7": ["auto 70%", "auto 70%"], //melee
}

const useStyles = makeStyles((theme) => ({

    "@global": {
        "@keyframes fadeOut": {
            "0%": {
                transform: "rotate(-360deg)"
            },
            "100%": {
                transform: "rotate(0deg)"
            }
        }
    },

    weaponContainerVideo: {
        position: "absolute",
        objectFit: "cover",
        width: "auto",
        height: "auto",
    },

    weaponPaper: {
        flexDirection: "row",
        position: "relative",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        transition: ".5s ease !important",
        "&:hover": {
            border: `1px ${theme.palette.primary.main} solid`
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

    bottomGradient: {
        //background: "linear-gradient(to bottom, rgba(0,0,0,0) 60%,rgba(255,255,255,.15) 100%)",
        zIndex: 5,
        width: "100%",
        height: "100%",
        top: "-100%",
    },

    dataContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        top: "-100%"
    },

    textContainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundPosition: "center",
        overflow: "visible",
        paddingLeft: "12px",
        paddingBottom: "8px",
        zIndex: 2,
    },

    buddyContainer: {
        display: "flex",
        maxWidth: "100px",
        height: "100%",
        position: "relative",
        right: 0,
        bottom: 8,
        zIndex: 2,
    },

    buddyImage: {
        width: "100%",
        height: "auto",
        objectFit: "contain",
        position: "relative",
        alignSelf: "flex-end",
    },

    weaponLabelHolder: {
        display: "flex",
        width: "80%",
        height: "25px",
        position: "relative",
        alignSelf: "flex-start",
    },

    skinLabelHolder: {
        width: "80%",
        alignSelf: "flex-start",
        position: "relative",
    },

    weaponLabel: {
        textAlign: "left",
        width: "100%",
        flexGrow: 1,
        position: "relative",
        textOverflow: "ellipsis",
        bottom: 0,
    },

}));


function Weapon(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [width, height] = useWindowDimensions();

    const [isUpdatingImage, setUpdatingImage] = useState(true);
    const [isUpdatingBuddy, setUpdatingBuddy] = useState(false);
    const [skinData, updateSkinData] = useState({});
    const [showSkinName, updateSkinNameVisibility] = useState(false);

    const [showVideo, setShowVideo] = useState(false)
    const [hoverTimeout, setHoverTimeout] = useState(null);

    const [tooltipText, setTooltipText] = useState("")

    const [scaleIndex, setScaleIndex] = useState(0);

    const [weaponImage, setImage] = useState("");

    const favorite = props.data !== undefined ? props.data.favorite : "";
    const locked = props.data !== undefined ? props.data.locked : "";
    const bugged = props.data !== undefined ? props.data.bugged : "";

    useEffect(() => {
        if (props.data !== undefined) {
            var comparisonTarget = skinData !== null ? skinData.skin_image : ""
            if (props.data.skin_image !== comparisonTarget) {

                setUpdatingImage(true)
                setTimeout(() => {
                    setImage(props.data.skin_image)
                    updateSkinData(props.data);
                    setUpdatingImage(false);
                }, 300)

            }

            //update buddy
            if (props.data.buddy_name !== skinData.buddy_name) {
                
                setUpdatingBuddy(true);
                setTimeout(() => {
                    updateSkinData(props.data);
                    setUpdatingBuddy(false);
                }, 300);
            }
        }
    }, [props.data]);

    useEffect(() => {
        if (width / height > 1.75) {
            setScaleIndex(1);
        } else {
            setScaleIndex(0);
        }
    }, [width, height])

    useEffect(() => {
        if(skinData.skin_name === "Random Favorite Skin"){
            setTooltipText("Select a different skin in the VALORANT client then refresh using the button in the topbar to edit this weapon.")
        } else {
            setTooltipText("")
        }
    }, [skinData])

    function onHover() {
        updateSkinNameVisibility(true);
        setHoverTimeout(setTimeout(() => {
            setShowVideo(true);
        }, 750))
    };

    function offHover() {
        updateSkinNameVisibility(false);
        clearTimeout(hoverTimeout);
        setShowVideo(false);
    };

    function select() {
        console.log(props)
        if (!bugged && props.data !== undefined) {
            console.log(props)
            // make sure the skin isn't falsely being displayed in inventory (if it's refunded everything breaks)
            props.weaponEditorCallback(props.uuid);
        }
    }

    return (
        <Fade in style={{ transitionDelay: '500ms', transition: ".25s width ease !important" }}>
            <Tooltip disabled={tooltipText === ""} title={tooltipText} arrow>
                <Paper
                    className={classes.weaponPaper}
                    variant="outlined"
                    onMouseEnter={onHover}
                    onMouseLeave={offHover}
                    onClick={select}

                >
                    <Fade in={!isUpdatingImage}>
                        <div
                            className={classes.weaponImage}
                            style={{
                                //backgroundPosition: props.uuid === "2f59173c-4bed-b6c3-2191-dea9b58be9c7" ? "50% 35%" : (!props.useLargeWeaponImage ? "50% 40%" : "50% 50%"), 
                                backgroundPosition: "50% 50%",
                                backgroundImage: skinData !== {} ? `url(${weaponImage})` : `url("https://media.valorant-api.com/weapons/${props.uuid}/displayicon.png")`,
                                backgroundSize: weaponImageScales[props.uuid][scaleIndex],
                                overflow: "hidden"
                                //props.uuid !== "2f59173c-4bed-b6c3-2191-dea9b58be9c7" ? (!props.useLargeWeaponImage ? `${props.uuid in weaponImageScales ? weaponImageScales[props.uuid][0] : stockImageSize} auto` : `calc(${weaponImageScales[props.uuid][0]} + ${weaponImageScales[props.uuid][1]}) auto`) : "auto 80%",
                            }}
                        >
                            <Fade in={showVideo} timeout={500} mountOnEnter unmountOnExit style={{ overflow: "hidden", }}>
                                <video preload src={skinData.chroma_video !== null ? skinData.chroma_video : (skinData.level_video !== null ? skinData.level_video : null)} type="video/mp4" controls={false} muted autoPlay onEnded={() => { setShowVideo(false) }} style={{ filter: "brightness(0.6)", width: "100%", height: "100%", position: "absolute", objectFit: "cover", overflow: "hidden", flexGrow: 0, alignSelf: "center", borderRadius: "4px" }} />
                            </Fade>
                        </div>
                    </Fade>

                    {/* <div className={classes.bottomGradient} /> */}

                    <div className={classes.dataContainer}>
                        <div className={classes.textContainer}>
                            <div className={classes.weaponLabelHolder}>
                                <Typography className={classes.weaponLabel} variant="overline">{locked ? "🔒 " : null}{props.displayName}</Typography>
                            </div>
                            <div className={classes.skinLabelHolder}>
                                <Collapse in={showSkinName}>
                                    <Typography className={classes.weaponLabel} variant="body1" style={{ marginBottom: "4px" }}>{favorite ? "❤ " : null}{skinData.skin_name}</Typography>
                                </Collapse>
                            </div>
                        </div>
                        <Grow in={!isUpdatingBuddy}>
                            <div className={classes.buddyContainer} style={{ width: props.isSidearm ? "20%" : "14%" }}>
                                {props.uuid !== "2f59173c-4bed-b6c3-2191-dea9b58be9c7" ?
                                    <img alt={skinData.buddy_name} className={classes.buddyImage} src={skinData.buddy_image !== "" ? skinData.buddy_image : null} />
                                    : <img alt="" src="" />
                                }
                            </div>
                        </Grow>
                    </div>
                </Paper>
            </Tooltip>
        </Fade>
    )

}

export default Weapon