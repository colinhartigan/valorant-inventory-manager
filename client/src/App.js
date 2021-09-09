import React from 'react';
import { useEffect, useState, useRef } from 'react';

//utilities
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Switch, Route, HashRouter, Redirect } from "react-router-dom";
import { socket } from "./services/Socket";


//pages
import Home from './pages/Home'

//components
import WebsocketHandshake from './components/WebsocketHandshake';

const mainTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#fa7581',
        },
        secondary: {
            main: '#616161',
        },
    },
    overrides: {
        MuiCssBaseline: {
            // this is fine for now but perhaps make the background transparent in the future
            "@global": {
                body: {
                    scrollbarColor: "#6b6b6b #2b2b2b",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#6b6b6b",
                        minHeight: 24,
                        border: "3px solid #2b2b2b",
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#959595",
                    },
                    "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                        backgroundColor: "#2b2b2b",
                    },
                },
            },
        },
    },
})

function App(props) {
    const [isLoading, setLoading] = useState(true);
    const [showLoad, setShowLoad] = useState(true);
    const socketCheck = useRef(null)

    // WEBSOCKETS MAKE ME WANT TO KILL MYSELF (9/6/2021)
    //----------------------------------------------------------------------------------

    useEffect(() => {
        checkForSocket();
        socketCheck.current = setInterval(() => {
            checkForSocket()
        }, 1000);
    }, [])

    const checkForSocket = () => {
        try {
            socket.send(JSON.stringify({"request":"handshake"})) //send data to the server
        } catch (error) {
            console.log("socket aint ready");
        }

        socket.onmessage = (message) => {
            setShowLoad(false);
            setTimeout(() => {
                setLoading(false);
                clearInterval(socketCheck.current)
                socketCheck.current = null
            }, 250);
        }
    };

    return (
        <React.Fragment>
            <ThemeProvider theme={mainTheme}>
                <CssBaseline />

                {isLoading ? 
                    <WebsocketHandshake open={showLoad}/> :
                
                    <HashRouter>
                        <Switch>
                            <Route exact path="/">
                                <Redirect to="/home" />
                            </Route>
                            <Route exact path="/home">
                                <Home />
                            </Route>
                        </Switch>
                    </HashRouter>
                }

            </ThemeProvider>
        </React.Fragment>
    );
}


export default App;