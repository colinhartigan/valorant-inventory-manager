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
import { Autorenew } from '@mui/icons-material';

import { useProfile } from '../../../services/useProfiles';
import SnackbarFeedback from '../../snackbarFeedback/SnackbarFeedback';

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

    const [snackbarTrigger, setSnackbarTrigger] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");

    const [profile, _, profileUuid] = useProfile()
    const [equippedUuid, setEquippedUuid] = useState(profile.uuid)
    const [targetedUuid, setTargetedUuid] = useState(null)
    const [loading, setLoading] = useState(false)
    const data = props.data

    function selectProfile(event, uuid) {
        if (uuid !== null) {
            setTargetedUuid(uuid)
            setLoading(true)
            props.selectCallback(uuid)
        }
    }

    useEffect(() => {
        if (profile.name !== undefined && profile.uuid !== equippedUuid) {
            setSnackbarText(`Equipped profile: ${profile.name}`)
            setSnackbarTrigger(true)
            setLoading(false)
            setEquippedUuid(profile.uuid)
        }
    }, [profile])

    useEffect(() => {
        setEquippedUuid(profile.uuid)
    }, [])

    return (
        <>
            <SnackbarFeedback trigger={snackbarTrigger} setTrigger={setSnackbarTrigger} type="success" text={snackbarText} />
            <div style={{ width: "auto", height: "100%", padding: "10px 0px", display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center", flexGrow: 1, gap: "20px" }}>
                <Button variant="contained" disableElevation color="secondary" onClick={props.editCallback} sx={{ width: "auto", height: "100%", whiteSpace: "nowrap" }}>Profiles</Button>
                <ToggleButtonGroup
                    value={equippedUuid}
                    exclusive
                    onChange={selectProfile}
                    aria-label="profile"
                    sx={{ width: "100%", height: "100%" }}
                >
                    {data.map((item) => {
                        return (
                            <Tooltip arrow title={item.name} key={item.uuid}>
                                <ToggleButton value={item.uuid} selected={item.uuid === equippedUuid}>
                                    {targetedUuid === item.uuid && loading ?
                                        <Autorenew sx={{ animation: "spin 4s linear infinite", width: "1.65rem", height: "1.65rem" }} />
                                        :
                                        <Icon path={numericToIcon[item.order]} size={1.1} color="white" />
                                    }
                                </ToggleButton>
                            </Tooltip>
                        )
                    })}
                </ToggleButtonGroup>
            </div>
        </>
    )
}

export default ProfileSelect;