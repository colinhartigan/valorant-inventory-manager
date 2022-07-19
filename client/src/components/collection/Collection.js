import { React, useState, useRef, useEffect } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Grid, Container, Typography } from '@material-ui/core';

//icons
import { AspectRatio } from '@material-ui/icons';

import Weapon from './sub/WeaponCollectionItem.js'
import SkinChangerWarning from './sub/SkinChangerWarning.js';

//services
import useWindowDimensions from '../../services/useWindowDimensions.js';
import { loadoutGridOrder } from '../../services/ClientConfig.js';



const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
        width: "100%",
        height: "100%",
        flexGrow: 1,
    },

    collectionItem: {
        display: "flex",
        height: "20%",
        minHeight: "115px",
        width: "100%",
        flexGrow: 1,
    },
}));


function Collection(props) {

    const classes = useStyles();

    const [width, height] = useWindowDimensions();

    const [smallWindow, setSmallWindow] = useState(false);
    const [useLargeWeaponImage, setUseLargeWeaponImage] = useState(false);

    useEffect(() => {
        setSmallWindow(width < 960);
        setUseLargeWeaponImage(width < 960 || width > 1300);
    }, [width])

    return (
        <>
            {!smallWindow ?
                (
                    <>
                        {props.loadout !== null ? <SkinChangerWarning skinsOwned={props.skinsOwned}/> : null}
                        <Grid className={classes.root} style={props.style} container justifyContent="center" direction="row" alignItems="center" spacing={3}>
                            {loadoutGridOrder.map(row => {
                                if (props.loadout !== null) {
                                    return (
                                        row.map(data => {
                                            if (data.type === "weapon") {
                                                return <Grid className={classes.collectionItem} item key={data.uuid} md={data.sidearm === true ? 2 : 3} sm={12} xs={12}><Weapon data={props.loadout[data.uuid]} uuid={data.uuid} displayName={data.displayName} useLargeWeaponImage={useLargeWeaponImage} weaponEditorCallback={props.weaponEditorCallback} isSidearm={data.sidearm} /></Grid>
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
                    </>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                        <AspectRatio style={{ fontSize: 60 }} />
                        <Typography variant="h6" style={{ marginTop: "10px", textAlign: "center" }}>
                            Make your window bigger for this page to work properly
                        </Typography>
                    </div>
                )
            }
        </>
    )
}


export default Collection;