import { React, useState, useRef, useEffect } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grid, InputBase, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

//icons


const useStyles = makeStyles((theme) => ({

}));

function WeaponSelectDialog(props) {

    const classes = useStyles();
    const theme = useTheme();

    return (
        //MAKE THIS A HOOK PLS THX
        <Dialog open={true} fullWidth maxWidth="md" onClose={null}>
            <DialogTitle>Equip (buddy name)</DialogTitle>
            <DialogContent className={classes.content}>
                <DialogContentText style={{ marginBottom: "20px", }}>
                    
                    

                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={null}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default WeaponSelectDialog;