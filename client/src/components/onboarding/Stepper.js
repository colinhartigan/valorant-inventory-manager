

import {React, useEffect, useState} from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Step, Stepper, StepLabel, Typography, Toolbar, IconButton, Container, Paper } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({    
    stepper: {
        
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