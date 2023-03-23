import { useState } from 'react';

import { Dialog, DialogTitle, DialogContent, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Collapse, Avatar, IconButton, TextField, DialogActions } from '@mui/material';
import { mdiNumeric1Box, mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box, mdiNumeric5Box, mdiNumeric6Box, mdiNumeric7Box, mdiNumeric8Box, mdiNumeric9Box } from '@mdi/js';
import Icon from '@mdi/react'
import { Delete, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import DeleteConfirmation from './sub/DeleteConfirmation';

function ProfileEdit(props) {
    const [showProfileEdit, setShowProfileEdit] = useState(false);

    function toggleEdit() {
        setShowProfileEdit(!showProfileEdit);
    }

    return (
        <Dialog open={true} fullWidth maxWidth={"xs"}>
            {/* <DeleteConfirmation/> */}
            <DialogTitle>Manage collection profiles</DialogTitle>
            <DialogContent>
                <List>


                    <ListItem disablePadding secondaryAction={
                        <IconButton edge={"end"}>
                            <Delete />
                        </IconButton>
                    }>
                        <ListItemButton onClick={toggleEdit}>
                            <ListItemAvatar>
                                <Avatar style={{ background: "transparent" }}>
                                    <Icon path={mdiNumeric1Box} size={1} color="white" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                                A creative profile name
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={showProfileEdit}>
                        <List component="div" disablePadding sx={{ background: "#" }}>
                            <ListItem sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                                <TextField sx={{ width: "100%" }} size="small" variant="outlined" label="Profile name" />
                                <IconButton><KeyboardArrowUp/></IconButton>
                                <IconButton><KeyboardArrowDown/></IconButton>
                            </ListItem>
                        </List>
                    </Collapse>


                </List>
            </DialogContent>
            <DialogActions>
                <Button color="primary" disableElevation>cancel</Button>
                <Button color="primary" disableElevation>save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProfileEdit;