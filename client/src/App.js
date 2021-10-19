import { useEffect, useState, useRef } from 'react';
import AnimatedCursor from "react-animated-cursor"

//utilities
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Switch, Route, HashRouter, Redirect } from "react-router-dom";
import { request } from "./services/Socket";


//pages
import CollectionHome from './pages/CollectionHome'

//components
import WebsocketHandshake from './components/WebsocketHandshake';

const mainTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#fa7581',
        },
        secondary: {
            main: '#454545',
        },
    },
    overrides: {
        MuiCssBaseline: {
            // this is fine for now but perhaps make the background transparent in the future
            "@global": {
                body: {
                    "&::-webkit-scrollbar": {
                        width: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                        boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "darkgrey",
                        outline: `1px solid slategrey`,
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
        request({ "request": "handshake" }) //send data to the server
            .then(data => {
                if (data.success) {
                    setShowLoad(false);
                    setTimeout(() => {
                        setLoading(false);
                        clearInterval(socketCheck.current)
                        socketCheck.current = null
                    }, 100);
                }
            });
    };


    return (
        <ThemeProvider theme={mainTheme}>
            <CssBaseline />
            {/* <AnimatedCursor
                color="255,255,255"
                innerSize={12}
                outerSize={18}
                outerScale={1.5}
                trailingSpeed={4}
            /> */}

            {isLoading ?
                <WebsocketHandshake open={showLoad} /> :

                <HashRouter>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/collection" />
                        </Route>
                        <Route exact path="/collection">
                            <CollectionHome />
                        </Route>
                    </Switch>
                </HashRouter>
            }

        </ThemeProvider>
    );
}


export default App;