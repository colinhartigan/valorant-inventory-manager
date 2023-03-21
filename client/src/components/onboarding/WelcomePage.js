

import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { List, ListItem, ListItemText, Typography, Divider, Button, Container, Paper } from '@mui/material'


const useStyles = makeStyles((theme) => ({

    headerText: {
        justifySelf: "center",
        textAlign: "center",
        background: "linear-gradient(90deg, rgba(173, 81, 89, 1) 0%, rgba(250,117,129,1) 100%, rgba(255,190,190,1) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        alignSelf: "flex-end",
    },

    bodyText: {
        marginTop: "3px",
        justifySelf: "center",
        textAlign: "center",
    },

    list: {
        width: "400px",
        justifySelf: "center",
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        paddingTop: "0px",
    },

    listItem: {
        justifySelf: "center",
        textAlign: "center",
        padding: "2px",
    },

    buttonDiv: {
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        flexGrow: 1,
        marginTop: "5px",
        justifyContent: "flex-end",
    },

    startButton: {
        width: "100%",
        height: "37px",
        alignSelf: "center",
        marginBottom: "15px",
    }
}));


function WelcomePage(props) {

    const classes = useStyles();
    const theme = useTheme();

    const features = [
        "favorites system",
        "automatic randomization",
        "other stuff",
        "",
    ]

    const style = props.pageStyle

    return (
        <div style={style}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-end", height: "100%" }}>
                <Typography variant="h2" className={classes.headerText}>
                    <strong>VIM</strong>
                </Typography>
                {/* <Typography variant="subtitle2" style={{ alignSelf: "flex-end" }} >
                    v1.0.0
                </Typography> */}
            </div>
            <Typography variant="h6" className={classes.bodyText}>
                VALORANT inventory management, expanded
            </Typography>

            {/* <Divider variant="middle" style={{ margin: "10px", }} />

            <List className={classes.list} dense>
                {features.map((feature) => (
                    <ListItem key={feature} className={classes.listItem}>
                        <ListItemText
                            primary={feature}
                        />
                    </ListItem>
                ))}
            </List> */}

            <div className={classes.buttonDiv}>
                <Button variant="outlined" color="primary" onClick={props.nextCallback} className={classes.startButton}>
                    Get Started
                </Button>
            </div>
        </div>
    )
}

export default WelcomePage