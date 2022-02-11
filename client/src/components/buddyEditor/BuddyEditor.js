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

                    {/* 
                    - buddy name
                    - buddy image
                    - buddy instance count

                    - box to show what its equipped on
                    
                    - option to favorite it
                    - option to add "super favorite" or something (always in the randomizer pool, but can only choose (total weapons - weapons w/ locked buddies) buddies)
                        - guarantees at least one instance of the buddy will be equipped

                    - repeatable instance menu thing
                        - option to lock it to specific weapon (dropdown or make a diff modal thats more intuitive?)
                        
                    */}

                </Paper>
            </Container>
        </Backdrop>
    )
}

export default BuddyEditor