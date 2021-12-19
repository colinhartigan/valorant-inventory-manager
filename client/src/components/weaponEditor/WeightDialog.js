import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slider  } from '@material-ui/core'

//icons
import { FitnessCenter } from '@material-ui/icons'


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

    const [weight, setWeight] = useState(props.weight);

    useEffect(() => {
        setWeight(props.weight)
    }, [props.weight])

    function close(){
        props.close(false)
    }

    function save(){

    }

    return (
        <Dialog open={props.open} fullWidth maxWidth="xs" onClose={close}>
            <DialogTitle>Randomizer Weight</DialogTitle>
            <DialogContent className={classes.content}>
                <DialogContentText style={{marginBottom: "20px", }}>
                    Weight for this skin is proportional to the weights of your other favorited skins.
                </DialogContentText>
                <Slider
                    defaultValue={30}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                    value={weight}
                    onChange={(e, value) => setWeight(value)}
                />

            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={close}>
                    Cancel
                </Button>
                <Button color="primary" onClick={() => {props.saveCallback(weight)}}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default WeightDialog;