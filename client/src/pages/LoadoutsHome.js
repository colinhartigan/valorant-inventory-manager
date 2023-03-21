import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Grid } from '@mui/material'

import Loadouts from '../components/loadouts/Loadouts';

//icons

function LoadoutsHome(props) {


    return (
        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", overflow: "auto", flexGrow: 1 }}>

            <Loadouts />

        </div>
    )
}

export default LoadoutsHome