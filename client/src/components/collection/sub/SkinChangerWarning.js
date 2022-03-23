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
    const [enableButton, setEnableButton] = useState(false);
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        if(skinsOwned > Config.SKIN_CHANGER_WARNING_THRESHOLD && skinsOwned !== -1){
            setAcknowledged(true);
        }
        if((!acknowledged && skinsOwned < Config.SKIN_CHANGER_WARNING_THRESHOLD) && skinsOwned !== -1){
            setOpen(true);
        }
    }, [skinsOwned]);

    useEffect(() => {
        if(open){
            setTimeout(() => {
                setEnableButton(true);
            }, 3000);
        }
    }, [open])

    return (
        <Dialog open={open} fullWidth maxWidth="xs" onClose={null}>
            <DialogTitle>⚠️ VIM is NOT a skin changer ⚠️</DialogTitle>
            <DialogContent className={classes.content}>
                <DialogContentText style={{ }}>
                    You own {skinsOwned} skins. VIM is NOT a skin changer and will not give you "free skins". VIM only works with skins you own.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={!enableButton} color="primary" onClick={() => {setAcknowledged(true); setOpen(false);}}>
                    I understand
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default SkinChangerWarning;
