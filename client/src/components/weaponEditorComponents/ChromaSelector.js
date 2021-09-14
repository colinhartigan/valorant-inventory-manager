import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Grid, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({

}));


function ChromaSelector(props) {

    const classes = useStyles();

    return (
        <div style={{ width: "50%", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <ToggleButtonGroup
                value={"2"}
                exclusive
                onChange={null}
                aria-label="skin level"
                style={{ width: "90%", height: "95%" }}
            >
                <ToggleButton value="chroma 1 uuid" aria-label="level 1">
                    <img src="https://media.valorant-api.com/weaponskinchromas/e9014a77-4a74-4ea7-999c-44b0d0f84daa/swatch.png" style={{ width: "90%", height: "auto" }} />

                </ToggleButton>
                <ToggleButton value="2" aria-label="level 2">
                    <img src="https://media.valorant-api.com/weaponskinchromas/e924a97d-46aa-3c3e-ec39-9abfeb811f2b/swatch.png" style={{ width: "90%", height: "auto" }} />

                </ToggleButton>
                <ToggleButton value="3" aria-label="level 3">
                    <img src="https://media.valorant-api.com/weaponskinchromas/449a0d94-4320-dd8c-d458-fba5fdc04eb0/swatch.png" style={{ width: "90%", height: "auto" }} />
                </ToggleButton>
                <ToggleButton value="4" aria-label="level 4">
                    <img src="https://media.valorant-api.com/weaponskinchromas/7e10eabf-476b-0bcb-5847-e8958d6f1132/swatch.png" style={{ width: "90%", height: "auto" }} />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

export default ChromaSelector;