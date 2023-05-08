import { useState, useEffect } from "react";
import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Collapse, Avatar, IconButton, TextField } from "@mui/material";

import { mdiNumeric1Box, mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box, mdiNumeric5Box, mdiNumeric6Box, mdiNumeric7Box, mdiNumeric8Box, mdiNumeric9Box } from '@mdi/js';
import Icon from '@mdi/react'
import { Delete, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

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

function ProfileItem(props) {

    const toggleEdit = props.toggleEdit;
    const showProfileEdit = props.showProfileEdit;
    const move = props.move
    const changeName = props.changeName
    const confirmDelete = props.confirmDelete
    const canDelete = props.canDelete

    const data = props.data

    const [profileName, setProfileName] = useState(data.name)

    function expand(){
        toggleEdit(data.order)
    }

    function moveUp(){
        move(data.order, true)
    }

    function moveDown(){
        move(data.order, false)
    }

    function save(newName){
        changeName(data.order, newName)
        setProfileName(newName)
    }

    function deleteProfile(){
        confirmDelete(data.order)
    }

    useEffect(() => {
        setProfileName(data.name)
    }, [data.name])

    return (
        <>  
            <ListItem disablePadding secondaryAction={canDelete ? 
                <IconButton edge={"end"} onClick={deleteProfile}>
                    <Delete />
                </IconButton>
                : null
            }>
                <ListItemButton onClick={expand}>
                    <ListItemAvatar>
                        <Avatar style={{ background: "transparent" }}>
                            <Icon path={numericToIcon[data.order]} size={1} color="white" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText>
                        {data.name}
                    </ListItemText>
                </ListItemButton>
            </ListItem>
            <Collapse in={showProfileEdit}>
                <List component="div" disablePadding sx={{ background: "#" }}>
                    <ListItem sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                        <TextField sx={{ width: "100%", margin: "5px 0px" }} autoComplete='off' size="small" variant="outlined" label="Profile name" value={profileName} onChange={(e) => {save(e.target.value)}}></TextField>
                        <IconButton onClick={moveUp}><KeyboardArrowUp /></IconButton>
                        <IconButton onClick={moveDown}><KeyboardArrowDown /></IconButton>
                    </ListItem>
                </List>
            </Collapse>
        </>
    )
}

export default ProfileItem;