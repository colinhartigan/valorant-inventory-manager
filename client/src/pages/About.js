import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import Header from '../components/misc/Header.js'
import Footer from '../components/misc/Footer.js'

import { Grid, Container, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        width: "100%",
        height: "75px",
        paddingTop: "0px",
    },

    content: {
        width: "100%",
        padding: "10px",
        height: "auto",
        display: "flex",
        flexDirection: "column",
    },

    section: {
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },

}));


function About(props) {

    const classes = useStyles();
    const theme = useTheme();

    const licenses = {
        "React": "https://raw.githubusercontent.com/facebook/react/main/LICENSE",
        "Material-UI": "https://raw.githubusercontent.com/mui/material-ui/master/LICENSE",
        "Requests": "https://raw.githubusercontent.com/psf/requests/main/LICENSE",
        "Websockets": "https://raw.githubusercontent.com/aaugustin/websockets/main/LICENSE",
        "PSUtil": "https://raw.githubusercontent.com/giampaolo/psutil/master/LICENSE",
    }

    const [licenseTexts, setLicenseTexts] = useState({});
    const [licenseDivs, setLicenseDivs] = useState([]);

    useEffect(() => {
        document.title = "VIM // About"

        setLicenseTexts({});
        setLicenseDivs([]);
        for(const [key, value] of Object.entries(licenses)) {
            fetch(value)
            .then(response => response.text())
            .then(text => setLicenseTexts({...licenseTexts, [key]: text}))
        }
    }, []);

    useEffect(() => {
        for(const [key,value] of Object.entries(licenseTexts)) {
            var name = key;
            var lice = value
            setLicenseDivs([...licenseDivs, 
                <div style={{ width: "100%", margin: "10px 0px 20px 0px" }}>
                    <Typography variant="h5" style={{ marginBottom: "5px" }}>{name}</Typography>
                    <Typography variant="body2" style={{whiteSpace: "pre-wrap"}}>
                        {lice}
                    </Typography>
                </div>
            ])
        }
    }, [licenseTexts]);

    return (
        <>
            <div style={{ height: "100%", width: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1 }}>
                <Container maxWidth={"xl"} style={{ width: "100%", height: "100%", display: "flex", flexGrow: 1, flexDirection: "column", }}>

                    <div className={classes.header}>
                        <Typography variant="h4" style={{ color: theme.palette.primary.light, fontSize: "2.2rem", flexGrow: 1, margin: "auto" }}>About VIM</Typography>
                    </div>

                    <div className={classes.content}>
                        <div className={classes.section}>
                            <Typography variant="h3" style={{ color: "white", fontSize: "2rem", marginBottom: "10px", }}>Motivation</Typography>
                            <Typography variant="body1">
                                VIM was created out of frustration for VALORANT's native inventory system. I aimed to create a simple and intuitive interface to expand the functionality of the inventory system without overcomplicating it.
                                Ultimately, I hope Riot recognizes the potential of the additional features I have implemented and adds them to VALORANT natively. With this, VIM should become obselete and the need for an external program
                                to achieve the expected functionality would be removed. Ultimately, VIM was created as a personal exercise in React, Python, and development strategies for fun, but I am thrilled by the support it has gained.
                            </Typography>
                        </div>
                        <div className={classes.section} style={{ marginBottom: "50px", }}>
                            <Typography variant="h3" style={{ color: "white", fontSize: "2rem", marginBottom: "10px", }}>Thank yous</Typography>
                            <Typography variant="body1">
                                The creation of VIM would not have been possible without the help of the many members of VALORANT's third party developer community. The communal efforts of the community to reverse-engineer and understand
                                VALORANT's client API were instrumental in VIM's development.
                            </Typography>
                        </div>

                        <div className={classes.section}>
                            <Typography variant="h3" style={{ color: "white", fontSize: "2rem", marginBottom: "10px", }}>Third-party software</Typography>
                            <Typography variant="body1">
                                licenses for the big dependencies ¯\_(ツ)_/¯
                            </Typography>

                            <div style={{ width: "90%", marginLeft: "2%" }}>
                                {licenseDivs}
                            </div>
                        </div>
                    </div>


                </Container>
            </div>
        </>
    )
}


export default About