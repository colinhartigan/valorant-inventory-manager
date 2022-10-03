import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grid } from '@material-ui/core'

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