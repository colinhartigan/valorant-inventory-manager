import { React, useState, useRef, useEffect } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Fade, Grow, Paper, Typography, Chip } from '@material-ui/core';
import Icon from '@mdi/react'

//icons
import { Lock } from '@material-ui/icons'
import { mdiNumeric1Box, mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box, mdiNumeric5Box, mdiNumeric6Box, mdiNumeric7Box, mdiNumeric8Box, mdiNumeric9Box } from '@mdi/js';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "125px",
    },

    paper: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },

    content: {
        width: "100%",
        height: "100%",
    },

    header: {
        height: "30px",
        width: "90%",
        margin: "10px 0px 0px 15px",
    },

    tags: {
        width: "100%",
        height: "27px",
        marginTop: "5px",
        marginLeft: "15px",
        '& > *': {
            margin: "0px 5px 0px 0px",
        },
    },

    bottomContent: {
        width: "100%",
        height: "33px",
        marginTop: "10px",
        padding: "0px 10px 0px 10px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
    }

}));


function BuddyItem(props) {

    const classes = useStyles();
    const theme = useTheme();

    const buddyData = props.data
    const loadout = props.loadout

    const numericToIcon = {
        1: mdiNumeric1Box,
        2: mdiNumeric2Box,
        3: mdiNumeric3Box,
        4: mdiNumeric4Box,
        5: mdiNumeric5Box,
        6: mdiNumeric6Box,
        7: mdiNumeric7Box,
        8: mdiNumeric8Box,
        9: mdiNumeric9Box,
    }

    const [equippedWeaponImages, setEquippedWeaponImages] = useState([])

    useEffect(() => {
        var images = []
        //console.log(loadout)
        Object.keys(loadout).forEach(key => {
            var weapon = loadout[key]
            if (weapon.buddy_uuid === buddyData.uuid) {
                //console.log(weapon)
                if (!images.includes(weapon.weapon_killstream_icon)) {
                    images.push(weapon.weapon_killstream_icon)
                }
            }
        })
        setEquippedWeaponImages(images)
    }, [loadout])


    return (
        <Grow in>
            <div className={classes.root}>
                <Paper className={classes.paper} style={{
                    backgroundColor: "transparent",
                    backgroundImage: `url('${buddyData.display_icon}')`,
                    backgroundSize: "auto 70%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "100% 50%",
                }} variant="outlined">

                    <div className={classes.content}>
                        <div className={classes.header}>
                            <Typography variant="h5" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                {buddyData.display_name}
                            </Typography>
                        </div>
                        <div className={classes.tags}>
                            {
                                Object.keys(buddyData.instances).map((key) => {
                                    var instanceBuddyData = buddyData.instances[key]
                                    if (instanceBuddyData.locked_weapon_uuid !== "") {
                                        return (
                                            <Chip
                                                avatar={<Lock style={{ background: "transparent" }} />}
                                                label={instanceBuddyData.locked_weapon_display_name}
                                                color="primary"
                                                size="small"
                                            />
                                        )
                                    } else {
                                        return null
                                    }
                                })
                            }
                        </div>
                        <div className={classes.bottomContent}>
                            <div style={{ width: "90%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", overflow: "hidden" }}>
                                {
                                    equippedWeaponImages.map((image, i) => {
                                        return (
                                            <Fade in>
                                                <img src={image} alt="weapon" style={{ width: "auto", height: "100%", objectFit: "contain", float: "left", filter: "opacity(0.5)", marginRight: "10px", }} />
                                            </Fade>
                                            )
                                    })
                                }
                            </div>

                            <div style={{ width: "auto", height: "100%", display: "flex", marginLeft: "auto", flexDirection: "row", justifyContent: "flex-end", alignItems: "cetner" }}>
                                <Icon path={numericToIcon[buddyData.instance_count]} size={1.1} color="white" style={{ height: "100%", marginLeft: "auto", marginTop: "auto", filter: "opacity(0.5)" }} />
                            </div>
                        </div>
                    </div>

                </Paper>
            </div>
        </Grow>
    )

}

export default BuddyItem; 