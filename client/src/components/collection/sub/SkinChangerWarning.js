import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slider } from '@mui/material'

import useLocalStorage from '../../../services/useLocalStorage.js';
import { Config } from '../../../services/ClientConfig';


const useStyles = makeStyles((theme) => ({

}));

function SkinChangerWarning(props) {

    const classes = useStyles();
    const theme = useTheme();

    const time = 10;

    const [skinsOwned, setSkinsOwned] = useState(-1)
    const [acknowledged, setAcknowledged] = useLocalStorage("skinChangerWarningAcknowledged", false);
    const [enableButton, setEnableButton] = useState(false);
    const [timerText, setTimerText] = useState(`${time}`);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        var skinsOwned = props.skinsOwned
        setSkinsOwned(props.skinsOwned)
        if (skinsOwned > Config.SKIN_CHANGER_WARNING_THRESHOLD && skinsOwned !== -1) {
            setAcknowledged(true);
        }
        if ((!acknowledged && skinsOwned < Config.SKIN_CHANGER_WARNING_THRESHOLD) && skinsOwned !== -1) {
            setOpen(true);
        }
    }, [props.skinsOwned]);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setEnableButton(true);
                setTimerText("I understand")
            }, time * 1000);
            for (let i = time; i > 0; i--) {
                setTimeout(() => {
                    setTimerText(`[${i}]`);
                }, (time * 1000) - (1000 * i))
            }
        }
    }, [open])

    return (
        <Dialog open={open} fullWidth maxWidth="xs" onClose={null}>
            <DialogTitle>⚠️ VIM is NOT a skin changer ⚠️</DialogTitle>
            <DialogContent className={classes.content}>
                <DialogContentText style={{}}>
                    You own {skinsOwned} skins. VIM is NOT a skin changer and will not give you "free skins." VIM only works with skins you own.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={!enableButton} color="primary" onClick={() => { setAcknowledged(true); setOpen(false); }}>
                    {timerText}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default SkinChangerWarning;
