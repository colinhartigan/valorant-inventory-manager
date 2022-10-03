import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper, Typography } from '@material-ui/core'
import Icon from '@mdi/react'

//icons
import { mdiCircle } from '@mdi/js';

function LoadoutProfile(props) {

    return (

        <Paper variant="outlined" style={{ width: "100%", height: "250px", background: "transparent", padding: "10px" }}>

            <div style={{ width: "100%", height: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", }}>
                <Icon path={mdiCircle} size={0.5} color="white" style={{marginRight: "8px", marginLeft: "2px"}}/>
                <Typography variant="h5">
                    Raze
                </Typography>
            </div>

        </Paper>

    )
}

export default LoadoutProfile;