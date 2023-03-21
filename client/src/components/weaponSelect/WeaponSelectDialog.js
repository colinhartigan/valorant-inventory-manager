import { React, useState, useRef, useEffect } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Grid, InputBase, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

import Weapon from "./sub/WeaponSelectDialogItem"

//icons

//services
import { loadoutGridOrder } from '../../services/ClientConfig';
import { useLoadout } from '../../services/useLoadout';

const useStyles = makeStyles((theme) => ({

    weaponGrid: {
        width: "100%",
        height: "100%",
        margin: "0px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            width: 4,
        },
        "&::-webkit-scrollbar-track": {
            boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            outline: `1px solid slategrey`,
            backgroundClip: "padding-box",
        },
    },

    collectionItem: {
        display: "flex",
        height: "100px",
        width: "100%",
        flexGrow: 1,
    },

}));

function WeaponSelectDialog(props) {

    const classes = useStyles();
    const theme = useTheme();

    const callback = props.callback;
    const buddyData = props.buddyData;
    const instanceUuid = props.instanceUuid;
    const instanceNum = props.instanceNum;
    const disabledWeaponNames = props.disabledWeaponNames;

    const [open, setOpen] = useState(true);
    const [loadout, forceUpdateLoadout] = useLoadout();

    function close(weapon){
        setOpen(false);
        setTimeout(() => {
            callback(weapon, instanceUuid);
        }, 500);
    }

    return (
        //MAKE THIS A HOOK PLS THX
        <Dialog open={open} fullWidth maxWidth="md" onClose={null}>
            <DialogTitle>Equip {buddyData.display_name} [{instanceNum}]</DialogTitle>
            <DialogContent style={{ display: "flex", flexGrow: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", }}>

                    <Grid className={classes.weaponGrid} columns={11} container justifyContent="center" direction="row" alignItems="center" spacing={0} >
                        {loadoutGridOrder.map(row => {
                            if (props.loadout !== null) {
                                return (
                                    row.map(data => {
                                        if (data.type === "weapon") {
                                            return <Grid className={classes.collectionItem} item p={1.5} key={data.uuid} md={data.sidearm === true ? 2 : 3} sm={12} xs={12}><Weapon disable={data.uuid === "2f59173c-4bed-b6c3-2191-dea9b58be9c7" || disabledWeaponNames.includes(data.displayName)} weaponUuid={data.uuid} data={loadout[data.uuid]} callback={close} /></Grid>
                                        }
                                        else {
                                            return (<Grid key="placeholder" className={classes.collectionItem} item md={6} sm={false} xs={false} />);
                                        }
                                    })
                                )
                            } else {
                                return null;
                            }
                        })}
                    </Grid>


            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => {close(null)}}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default WeaponSelectDialog;