import { Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Collapse, Avatar, IconButton } from '@mui/material';
import { mdiNumeric1Box, mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box, mdiNumeric5Box, mdiNumeric6Box, mdiNumeric7Box, mdiNumeric8Box, mdiNumeric9Box } from '@mdi/js';
import Icon from '@mdi/react'
import { Delete } from '@mui/icons-material';

function ProfileEdit(props) {


    return (
        <Dialog open={true} fullWidth maxWidth={"xs"}>
            <DialogTitle>Manage collection profiles</DialogTitle>
            <DialogContent>
                <List>
                    <ListItem disablePadding secondaryAction={
                        <IconButton edge={"end"}>
                            <Delete />
                        </IconButton>
                    }>
                        <ListItemButton>
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
                    <Collapse in={true}>
                        <List component="div" disablePadding>
                            <ListItem sx={{ background: "#0a0a0a" }}>
                                <ListItemText>
                                    profile editing area
                                </ListItemText>
                            </ListItem>
                        </List>
                    </Collapse>

                </List>
            </DialogContent>
        </Dialog>
    )
}

export default ProfileEdit;