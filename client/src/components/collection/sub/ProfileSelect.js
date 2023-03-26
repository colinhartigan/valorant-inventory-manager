import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Tooltip, Container, Typography, Toolbar, IconButton, Slide, Button } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Icon from '@mdi/react'

//icons 
import { mdiNumeric1Box, mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box, mdiNumeric5Box, mdiNumeric6Box, mdiNumeric7Box, mdiNumeric8Box, mdiNumeric9Box } from '@mdi/js';
import { useProfile } from '../../../services/useProfiles';

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

function ProfileSelect(props) {
    // const classes = useStyles();

    const [profile, bruh] = useProfile()
    const [equippedUuid, setEquippedUuid] = useState(profile.uuid)
    const data = props.data

    function selectProfile(event, uuid) {
        if (uuid !== null) {
            console.log(uuid)
            props.selectCallback(uuid)
        }
    }

    useEffect(() => {
        setEquippedUuid(profile.uuid)
    }, [profile])

    return (
        <div style={{ width: "auto", height: "100%", padding: "10px 0px", display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", flexGrow: 1, gap: "20px" }}>
            <Button variant="contained" disableElevation color="secondary" onClick={props.editCallback} style={{ width: "auto", height: "100%", whiteSpace: "nowrap" }}>Manage profiles</Button>
            <ToggleButtonGroup
                value={equippedUuid}
                exclusive
                onChange={selectProfile}
                aria-label="profile"
                style={{ width: "100%", height: "100%" }}
            >
                {data.map((item) => {
                    console.log(item.uuid, equippedUuid)
                    return (
                        <Tooltip arrow title={item.name} key={item.uuid}>
                            <ToggleButton selected={equippedUuid === item.uuid} value={item.uuid}>
                                <Icon path={numericToIcon[item.order]} size={1.1} color="white" />
                            </ToggleButton>
                        </Tooltip>
                    )
                })}
            </ToggleButtonGroup>
        </div>
    )
}

export default ProfileSelect;