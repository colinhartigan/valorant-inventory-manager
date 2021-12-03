import {React, useEffect, useState} from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Step, Stepper, StepLabel, Typography, Toolbar, IconButton, Container, Paper } from '@material-ui/core'
import OnboardingStepper from "../components/onboarding/Stepper";
import WelcomePage from "../components/onboarding/WelcomePage";

//icons
import { Settings, Shuffle, Autorenew } from '@material-ui/icons';

import { request } from "../services/Socket";


const useStyles = makeStyles((theme) => ({
    root: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    paper: {
        width: "500px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
    },

    pageContent: {
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
    }

}));

const pageStyle = {
    width: "90%",
    height: "90%",
    justifySelf: "center",
    display: "flex",
    flexDirection: "column",
}


function Onboarding(props) {

    const classes = useStyles();
    const theme = useTheme();
    
    const pages = [
        <WelcomePage pageStyle={pageStyle}/>,
    ]

    const [activeStep, setActiveStep] = useState(0);


    return (
        <Container maxWidth="xl" className={classes.root}>
            <Paper variant="outlined" className={classes.paper}>
                <OnboardingStepper activeStep={activeStep}/>
                <div className={classes.pageContent}>
                    {pages[activeStep]}
                </div>
            </Paper>
        </Container>
    )
}

export default Onboarding