

import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { List, ListItem, ListItemText, Typography, Divider, Button, Container, Paper } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({

    headerText: {
        justifySelf: "center",
        textAlign: "center",
        background: "linear-gradient(90deg, rgba(255,190,190,1) 0%, rgba(250,117,129,1) 50%, rgba(255,190,190,1) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
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
        "improved skin selection",
        "favorites system",
        "skin randomizer",
        "automatic randomization",
    ]

    const style = props.pageStyle

    return (
        <div style={style}>
            <Typography variant="h3" className={classes.headerText}>
                <strong>VSM</strong>
            </Typography>
            <Typography variant="body1" className={classes.bodyText}>
                VALORANT inventory management, expanded
            </Typography>

            <Divider variant="middle" style={{ margin: "10px", }} />

            <List className={classes.list} dense>
                {features.map((feature) => (
                    <ListItem className={classes.listItem}>
                        <ListItemText
                            primary={feature}
                        />
                    </ListItem>
                ))} 
            </List>

            <div className={classes.buttonDiv}>
                <Button variant="outlined" color="primary" onClick={props.nextCallback} className={classes.startButton}>
                    Get Started
                </Button>
            </div>
        </div>
    )
}

export default WelcomePage