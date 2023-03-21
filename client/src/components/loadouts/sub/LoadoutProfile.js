import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Paper, Typography } from '@mui/material'
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