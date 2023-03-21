import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slider } from '@mui/material'


import { Config } from '../../../services/ClientConfig';


const useStyles = makeStyles((theme) => ({
    "@global": {
        "@keyframes spin": {
            "0%": {
                transform: "rotate(-360deg)"
            },
            "100%": {
                transform: "rotate(0deg)"
            }
        }
    },

    content: {
        margin: "0px 10px 0px 10px"
    }

}))

function InfoPane(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(true);

    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={null}>
            <DialogTitle>VIM Status</DialogTitle>
            <DialogContent className={classes.content}>
                <DialogContentText style={{  }}>
                    this is a status text
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={null}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default InfoPane;