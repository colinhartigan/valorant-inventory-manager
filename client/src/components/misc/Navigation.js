import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Icon from '@mdi/react'

import { Drawer, Divider, List, IconButton, ListItem, ListItemIcon, ListItemText, } from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import { mdiPistol, mdiInformation, mdiAlert, mdiSpade } from '@mdi/js';


const widthClosed = "70px";
const widthOpen = "200px";

const useStyles = makeStyles((theme) => ({

    drawer: {
        width: widthOpen,
        overflow: "hidden",
        whiteSpace: 'nowrap',
        flexShrink: 1,
        justifyContent: "center",
    },

}));

function NavBar() {
    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false)

    const iconSize = 1.25;
    const tabs = [
        {
            "name": "Skins",
            "icon": mdiPistol,
        },
        {
            "name": "Buddies",
            "icon": mdiSpade,
        },
    ]

    return (
        <div style={{ display: "flex", }}>
            <Drawer
                variant="permanent"
                className={classes.drawer}
            >
                <List style={{ width: widthOpen, overflow: "hidden", flexGrow: 1, }}>


                    <div style={{width: "100%", padding: "10px 5px 10px 5px"}}>
                        <IconButton onClick={null}>
                            <ChevronLeft />
                        </IconButton>
                    </div> 

                    <Divider />

                    <div style={{width: "100%", marginTop: "10px"}}>
                        {tabs.map((tab, index) => (
                            <ListItem button key={tab.name}>
                                <ListItemIcon><Icon
                                    path={tab.icon}
                                    size={iconSize}
                                /></ListItemIcon>
                                <ListItemText primary={tab.name} />
                            </ListItem>
                        ))}
                    </div>


                    <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
                        <Divider />
                        <ListItem button key={"Status"}>
                            <ListItemIcon><Icon
                                path={mdiAlert}
                                size={1}
                            /></ListItemIcon>
                            <ListItemText primary={"Status"} />
                        </ListItem>
                        <ListItem button key={"about"}>
                            <ListItemIcon><Icon
                                path={mdiInformation}
                                size={1}
                            /></ListItemIcon>
                            <ListItemText primary={"About"} />
                        </ListItem>
                    </div>
                </List>
            </Drawer>
        </div>
    )
}

export default NavBar;