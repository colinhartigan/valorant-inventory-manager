import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Divider } from '@mui/material'

import { Grid, Container, Typography } from '@mui/material'

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
    const [date, setDate] = useState("")

    useEffect(() => {
        document.title = "VIM // About"

        setLicenseTexts({});
        setLicenseDivs([]);
        for (const [key, value] of Object.entries(licenses)) {
            fetch(value)
                .then(response => response.text())
                .then(text => setLicenseTexts({ ...licenseTexts, [key]: text }))
        }
        var dt = new Date()
        setDate(dt.getFullYear())
    }, []);

    useEffect(() => {
        for (const [key, value] of Object.entries(licenseTexts)) {
            var name = key;
            var lice = value
            setLicenseDivs([...licenseDivs,
            <div style={{ width: "100%", margin: "10px 0px 20px 0px" }}>
                <Typography variant="h5" style={{ marginBottom: "5px" }}>{name}</Typography>
                <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
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
                        <Typography variant="body1" style={{ marginBottom: "10px" }}>
                            © 2021-{date} Colin Hartigan. All Rights Reserved.
                        </Typography>

                        <div className={classes.section}>
                            <Typography variant="h3" style={{ color: "white", fontSize: "2rem", marginBottom: "10px", }}>Motivation</Typography>
                            <Typography variant="body1">
                                VIM was created out of frustration for VALORANT's native inventory system. I aimed to create a simple and intuitive interface to expand the functionality of the inventory system without overcomplicating it.
                                Ultimately, I hope Riot recognizes the potential of the additional features I have implemented and adds them to VALORANT natively. With this, VIM should become obselete and the need for an external program
                                to achieve the expected functionality would be removed. Ultimately, VIM was created as a personal exercise in React, Python, and development strategies for fun, but I am thrilled by the support it has gained.
                            </Typography>
                        </div>
                        <div className={classes.section} style={{ marginBottom: "10px", }}>
                            <Typography variant="h3" style={{ color: "white", fontSize: "2rem", marginBottom: "10px", }}>Thank yous</Typography>
                            <Typography variant="body1">
                                The creation of VIM would not have been possible without the help of the many members of VALORANT's third party developer community. The communal efforts of the community to reverse-engineer and understand
                                VALORANT's client API were instrumental in VIM's development.
                            </Typography>
                        </div>
                        <Divider style={{ margin: "15px 0px" }} />
                        <div className={classes.section} style={{ marginBottom: "10px", }}>
                            <Typography variant="h3" style={{ color: "white", fontSize: "2rem", marginBottom: "10px", }}>License</Typography>
                            <Typography variant="body1" style={{ lineHeight: ".5em", width: "95%", marginLeft: "1%" }}>
                                <p>MIT License</p>
                                <br />
                                <p>Copyright (c) 2022 Colin Hartigan</p>
                                <br />
                                <p>Permission is hereby granted, free of charge, to any person obtaining a copy</p>
                                <p>of this software and associated documentation files (the "Software"), to deal</p>
                                <p>in the Software without restriction, including without limitation the rights</p>
                                <p>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell</p>
                                <p>copies of the Software, and to permit persons to whom the Software is</p>
                                <p>furnished to do so, subject to the following conditions:</p>
                                <br />
                                <p>The above copyright notice and this permission notice shall be included in all</p>
                                <p>copies or substantial portions of the Software.</p>
                                <br />
                                <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR</p>
                                <p>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,</p>
                                <p>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE</p>
                                <p>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER</p>
                                <p>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,</p>
                                <p>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE</p>
                                <p>SOFTWARE.</p>
                            </Typography>
                        </div>

                        <div className={classes.section} style={{ marginBottom: "10px", }}>
                            <Typography variant="h3" style={{ color: "white", fontSize: "2rem", marginBottom: "10px", }}>Legal (Riot's Jibber Jabber)</Typography>
                            <Typography variant="body1" style={{ width: "95%", marginLeft: "1%" }}>
                                <p>This project is not affiliated with Riot Games or any of its employees and therefore does not reflect the views of said parties. This is purely a fan-made project to enhance VALORANT's inventory management.</p>
                                <p>Riot Games does not endorse or sponsor this project. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
                            </Typography>
                        </div>

                        <div className={classes.section}>
                            <Typography variant="h3" style={{ color: "white", fontSize: "2rem", marginBottom: "10px", }}>Third-party software</Typography>
                            <Typography variant="body1">
                                licenses for the big dependencies ¯\_(ツ)_/¯
                            </Typography>

                            <div style={{ width: "95%", marginLeft: "1%" }}>
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