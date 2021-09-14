import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Grid, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({


}));


function LevelSelector(props) {

    const classes = useStyles();

    return (
        <div style={{ width: "50%", display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>

            <ToggleButtonGroup
                value={"4"}
                exclusive
                onChange={null}
                aria-label="skin level"
                style={{ width: "90%", height: "95%" }}
            >
                <ToggleButton value="1" aria-label="level 1">
                    LVL1
                </ToggleButton>
                <ToggleButton value="2" aria-label="level 2">
                    LVL2
                </ToggleButton>
                <ToggleButton value="3" aria-label="level 3">
                    LVL3
                </ToggleButton>
                <ToggleButton value="4" aria-label="level 4">
                    LVL4
                </ToggleButton>
            </ToggleButtonGroup>

        </div>
    )
}

export default LevelSelector