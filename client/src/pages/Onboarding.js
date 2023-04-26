import {React, useEffect, useState} from 'react';
import {Redirect} from "react-router-dom";

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Step, Stepper, StepLabel, Typography, Toolbar, Grow, Container, Paper } from '@mui/material'
import OnboardingStepper from "../components/onboarding/Stepper";
import WelcomePage from "../components/onboarding/WelcomePage";
import AccountPage from "../components/onboarding/AccountPage";
import ConfigPage from "../components/onboarding/ConfigPage"

//icons
import { Settings, Shuffle, Autorenew } from '@mui/icons-material';

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
        height: "100%",
        alignItems: "center",
        flexDirection: "column",
    }

}));

const pageStyle = {
    width: "90%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
}


function Onboarding(props) {

    const classes = useStyles();
    const theme = useTheme();
    
    const pages = [
        <WelcomePage pageStyle={pageStyle} nextCallback={nextStep}/>,
        <AccountPage pageStyle={pageStyle} nextCallback={nextStep}/>,
        <ConfigPage pageStyle={pageStyle} nextCallback={nextStep}/>,
    ]

    const [activeStep, setActiveStep] = useState(0);
    const [redirect, setRedirect] = useState(null)

    function nextStep(){
        setActiveStep(activeStep + 1);
        console.log(activeStep)
        if(activeStep+1 > pages.length-1){
            console.log("redirect")
            setRedirect(<Redirect to="/vim"/>)
        }
    }

    return (
        <Container maxWidth="xl" className={classes.root}>
            {redirect}
            <Grow in>
                <Paper variant="outlined" className={classes.paper}>
                    <OnboardingStepper activeStep={activeStep}/>
                    <div className={classes.pageContent}>
                        {pages[activeStep]}
                    </div>
                </Paper>
            </Grow>
        </Container>
    )
}

export default Onboarding