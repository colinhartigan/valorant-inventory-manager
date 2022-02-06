import { React, useState, useRef, useEffect } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grow, Paper, Typography, Chip } from '@material-ui/core';

//icons
import { Lock } from '@material-ui/icons'

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
        width: "80%",
        height: "100%",
    },

    header: {
        height: "10%",
        width: "100%",
        margin: "10px 0px 0px 15px",
    },

    tags: {
        width: "100%",
        height: "25px",
        marginTop: "5px",
        '& > *': {
            margin: "0px 5px 0px 5px",
        },
    },

}));


function BuddyItem(props) {

    const classes = useStyles();
    const theme = useTheme();

    const data = props.data

    return (
        <Grow in>
            <div className={classes.root}>
                <Paper className={classes.paper} style={{
                    backgroundColor: "transparent",
                    backgroundImage: `url('${data.display_icon}')`,
                    backgroundSize: "auto 70%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "100% 50%",
                }} variant="outlined">

                    {/* 
                        need to display:
                            -name
                            -# owned
                            -use tags for what gun its locked to
                            -heart icon if favorited
                    */}

                    <div className={classes.content}>
                        <div className={classes.header}>
                            <Typography variant="h5">
                                {data.display_name} (x{data.instance_count})
                            </Typography>
                            <div className={classes.tags}>
                                {/* <Chip
                                    avatar={<Lock style={{ background: "transparent" }} />}
                                    label="Vandal"
                                    color="primary"
                                    size="small"
                                />
                                <Chip
                                    avatar={<Lock style={{ background: "transparent" }} />}
                                    label="Phantom"
                                    color="primary"
                                    size="small"
                                /> */}
                            </div>
                        </div>
                    </div>

                </Paper>
            </div>
        </Grow>
    )

}

export default BuddyItem; 