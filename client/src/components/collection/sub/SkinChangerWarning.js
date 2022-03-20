import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slider } from '@material-ui/core'

import useLocalStorage from '../../../services/useLocalStorage.js';
import {Config} from '../../../services/ClientConfig';


const useStyles = makeStyles((theme) => ({

}));

function SkinChangerWarning(props){

    const classes = useStyles();
    const theme = useTheme();

    const skinsOwned = props.skinsOwned

    const [acknowledged, setAcknowledged] = useLocalStorage("skinChangerWarningAcknowledged", false);
    
    useEffect(() => {
        if(skinsOwned > Config.SKIN_CHANGER_WARNING_THRESHOLD){
            setAcknowledged(true);
        }
    })

    return (
        <Dialog open={!acknowledged && skinsOwned < Config.SKIN_CHANGER_WARNING_THRESHOLD} fullWidth maxWidth="xs" onClose={null}>
            <DialogTitle>VIM is NOT a skin changer</DialogTitle>
            <DialogContent className={classes.content}>
                <DialogContentText style={{ }}>
                    You own {skinsOwned} skins. VIM is NOT a skin changer and will not give you "free skins". VIM only works with skins you own.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => {setAcknowledged(true)}}>
                    I understand
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default SkinChangerWarning;
