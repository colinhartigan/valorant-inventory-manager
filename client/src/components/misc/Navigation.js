import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { Drawer, Divider, List, IconButton, ListItem, ListItemIcon, ListItemText, } from '@material-ui/core';
import {  } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({

    drawer: {
        width: "100px",
        overflowX: "hidden",
        whiteSpace: 'nowrap',
        flexShrink: 1,
    },

}));

function NavBar() {
    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false)

    return (
        <div style={{display: "flex", }}>
            <Drawer
                variant="permanent"
                className={classes.drawer}
            >
                <List style={{width: "100px"}}>
                    {['a', 'a', 'Send b', 'b'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    )
}

export default NavBar;