import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grow, Backdrop, Paper, Grid, Container, Divider, IconButton, Tooltip, ClickAwayListener } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

    backdrop: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    mainPaper: {
        margin: "auto",
        width: "100%",
        height: "auto",
        minWidth: "400px",
        maxWidth: "600px",

        display: "flex",
        justifySelf: "flex-start",
        justifyContent: "center",
        alignContent: "flex-start",
        flexWrap: "wrap",
        overflow: "auto",
        "&::-webkit-scrollbar": {
            width: 4,
        },
        "&::-webkit-scrollbar-track": {
            boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            outline: `1px solid slategrey`,
            backgroundClip: "padding-box",
        },
    },
}))


function BuddyEditor(props) {

    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false);

    return (
        <Backdrop open={true} className={classes.backdrop} style={{ zIndex: 4 }}>
            <Container maxWidth={"lg"}>
                <Paper className={classes.mainPaper} variant="outlined">

                    

                </Paper>
            </Container>
        </Backdrop>
    )
}

export default BuddyEditor