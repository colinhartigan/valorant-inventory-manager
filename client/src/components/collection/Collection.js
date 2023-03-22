import { React, useState, useRef, useEffect } from 'react';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Grid, Container, Typography, Button } from '@mui/material';

//icons
import { AspectRatio } from '@mui/icons-material';

import Weapon from './sub/WeaponCollectionItem.js'
import SkinChangerWarning from './sub/SkinChangerWarning.js';

//services
import useWindowDimensions from '../../services/useWindowDimensions.js';
import { loadoutGridOrder } from '../../services/ClientConfig.js';
import ProfileSelect from './sub/ProfileSelect.js';



const useStyles = makeStyles((theme) => ({

    collectionItem: {
        display: "flex",
        height: "20%",
        minHeight: "115px",
        width: "100%",
        flexGrow: 0,
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
                        {props.loadout !== null ? <SkinChangerWarning skinsOwned={props.skinsOwned} /> : null}

                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                            {/* <div style={{ width: "100%", height: "60px", paddingLeft: "12px", display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center"}}>
                                <ProfileSelect/>
                            </div> */}

                            <Grid style={{ width: "100%", height: "auto", flexGrow: 1 }} columns={11} container justifyContent="center" direction="row" alignItems="center" spacing={0}>
                                {loadoutGridOrder.map(row => {
                                    if (props.loadout !== null) {
                                        return (
                                            row.map(data => {
                                                if (data.type === "weapon") {
                                                    return <Grid className={classes.collectionItem} item p={1.5} key={data.uuid} md={data.sidearm === true ? 2 : 3} sm={12} xs={12}><Weapon data={props.loadout[data.uuid]} uuid={data.uuid} displayName={data.displayName} useLargeWeaponImage={useLargeWeaponImage} weaponEditorCallback={props.weaponEditorCallback} isSidearm={data.sidearm} /></Grid>
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
                        </div>
                    </>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                        <AspectRatio style={{ fontSize: 60 }} />
                        <Typography variant="h6" style={{ marginTop: "10px", textAlign: "center" }}>
                            Make your window larger for this page to work properly
                        </Typography>
                    </div>
                )
            }
        </>
    )
}


export default Collection;