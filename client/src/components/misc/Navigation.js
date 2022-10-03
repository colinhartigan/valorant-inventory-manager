import { React, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Icon from '@mdi/react'

//components
import { Drawer, Divider, List, IconButton, ListItem, ListItemIcon, ListItemText, } from '@material-ui/core';

//icons
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { mdiPistol, mdiInformation, mdiAlert, mdiSpade, mdiFolderMultiple } from '@mdi/js';

//services
import { Config } from '../../services/ClientConfig.js'


const widthClosed = "60px";
const widthOpen = "200px";

const useStyles = makeStyles((theme) => ({

    drawer: {
        overflow: "hidden",
        whiteSpace: 'nowrap',
        flexShrink: 1,
        justifyContent: "center",
    },

}));

function NavBar(props) {
    const classes = useStyles();
    const theme = useTheme();

    const setTarget = props.setTarget;

    const [open, setOpen] = useState(false)

    const iconSize = 1.1;
    const tabs = [
        {
            "name": "Skins",
            "icon": mdiPistol,
            "path": "collection",
            "enabled": Config.ENABLED_PAGES.collection,
        },
        {
            "name": "Loadouts",
            "icon": mdiFolderMultiple,
            "path": "loadouts",
            "enabled": Config.ENABLED_PAGES.loadouts,
        },
        {
            "name": "Buddies",
            "icon": mdiSpade,
            "path": "buddies",
            "enabled": Config.ENABLED_PAGES.buddies,
        },
    ]

    function selectPage(path) {
        setTarget(path)
    }

    return (
        <>
            {Config.NAVIGATION_ENABLED ?
                <div style={{ display: "flex", }}>
                    <Drawer
                        variant="permanent"
                        className={classes.drawer}
                        style={{ width: (open ? widthOpen : widthClosed), transition: "width 0.2s ease" }}
                    >
                        <List style={{ width: (open ? widthOpen : widthClosed), overflow: "hidden", flexGrow: 1, transition: "width 0.2s ease"}}>


                            <div style={{ width: "100%", padding: "10px 5px 10px 5px" }}>
                                <IconButton onClick={() => {setOpen(!open)}}>
                                    { open ? <ChevronLeft /> : <ChevronRight />}
                                </IconButton>
                            </div>

                            <Divider />

                            <div style={{ width: "100%", marginTop: "10px" }}>
                                {tabs.map((tab, index) => (
                                    (tab.enabled ? 
                                        <ListItem button key={tab.name} onClick={() => { selectPage(tab.path) }}>
                                            <ListItemIcon><Icon
                                                path={tab.icon}
                                                size={iconSize}
                                            /></ListItemIcon>
                                            <ListItemText primary={tab.name} />
                                        </ListItem>
                                    : null)
                                ))}
                            </div>


                            <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
                                <Divider />
                                {/* <ListItem button key={"Status"}>
                                    <ListItemIcon><Icon
                                        path={mdiAlert}
                                        size={1}
                                    /></ListItemIcon>
                                    <ListItemText primary={"Status"} />
                                </ListItem> */}
                                <ListItem button key={"about"} onClick={() => {selectPage("about")}}>
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
                : null}
        </>
    )
}

export default NavBar;