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

function WeightDialog(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [weight, setWeight] = useState(0);

    const startTotalMinusThis = props.totalWeights - props.weight
    const [total, setTotal] = useState(startTotalMinusThis);

    useEffect(() => {
        if (props.open) {
            setWeight(props.weight)
            setTotal(startTotalMinusThis + weight);
        }
    }, [props.open])

    useEffect(() => {
        setTotal(startTotalMinusThis + weight);
    }, [weight])

    useEffect(() => {
        setWeight(props.weight)
    }, [props.weight])

    function cancel() {
        props.close(false)
        setWeight(props.weight)
    }

    function save() {
        props.saveCallback(weight, total)
    }

    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={cancel}>
            <DialogTitle>Randomizer Weight</DialogTitle>
            <DialogContent className={classes.content}>
                <DialogContentText style={{ marginBottom: "20px", }}>
                    Weights are relative, so there is a <strong>{Math.round((weight / total) * 100)}%</strong> chance this skin will be selected.
                </DialogContentText>
                <Slider
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={Config.WEIGHT_INTERVALS}
                    value={weight}
                    onChange={(e, value) => setWeight(value)}
                />

            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={cancel}>
                    Cancel
                </Button>
                <Button color="primary" onClick={save}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default WeightDialog;