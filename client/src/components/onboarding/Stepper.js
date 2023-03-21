

import {React, useEffect, useState} from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Step, Stepper, StepLabel, Typography, Toolbar, IconButton, Container, Paper } from '@mui/material'


const useStyles = makeStyles((theme) => ({    
    stepper: {
        margin: "20px"
    }
}));

const steps = [
    "Hello!",
    "VALORANT Account",
    "Settings",
]


function OnboardingStepper(props) {

    const classes = useStyles();
    const theme = useTheme();

    const activeStep = props.activeStep;


    return (
        <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label, index) => {
                return (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                );
            })}
        </Stepper>
    )
}

export default OnboardingStepper 