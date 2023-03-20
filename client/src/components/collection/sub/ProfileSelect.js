import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Tooltip, Container, Typography, Toolbar, IconButton, Slide, Button } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import Icon from '@mdi/react'

//icons 
import { mdiNumeric1Box, mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box, mdiNumeric5Box, mdiNumeric6Box, mdiNumeric7Box, mdiNumeric8Box, mdiNumeric9Box } from '@mdi/js';


function ProfileSelect(props) {
    // const classes = useStyles();
    const theme = useTheme();

    return (
        <div style={{ width: "auto", height: "100%", padding: "10px 0px", display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", flexGrow: 1, gap: "20px" }}>
            <Button variant="contained" disableElevation color="secondary" style={{width: "auto", height: "100%", whiteSpace: "nowrap"}}>Manage profiles</Button>
            <ToggleButtonGroup
                value={null}
                exclusive
                onChange={null}
                aria-label="profile"
                style={{ width: "100%", height: "100%" }}
            >
                <ToggleButton><Icon path={mdiNumeric1Box} size={1.1} color="white" /></ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

export default ProfileSelect;