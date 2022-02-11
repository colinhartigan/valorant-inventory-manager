import { useEffect, useState, useRef } from "react";

//utilities
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Switch, Route, HashRouter, Redirect } from "react-router-dom";
import socket from "./services/Socket";
import { Config, setVersion, ServerVersion } from "./services/ClientConfig"


//pages
import CollectionHome from "./pages/CollectionHome"
import BuddiesHome from "./pages/BuddiesHome"
import Onboarding from "./pages/Onboarding"

//components
import NavBar from './components/misc/Navigation'

//error pages
import ConnectionFailed from "./components/errors/ConnectionFailed.js"
import GameNotRunning from "./components/errors/GameNotRunning.js"
import WrongVersion from "./components/errors/WrongVersion.js"

//components
import WebsocketHandshake from "./components/misc/WebsocketHandshake";

const mainTheme = createTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#fa7581",
        },
        secondary: {
            main: "#454545",
        },
    },
    typography: {
        fontFamily: [
            'Chivo',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
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

    const [connected, setConnected] = useState(false);

    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [gameRunning, setGameRunning] = useState(false);

    const [ready, setReady] = useState(false);

    const [errorPage, setErrorPage] = useState(null);

    // WEBSOCKETS MAKE ME WANT TO KILL MYSELF (9/6/2021)
    //----------------------------------------------------------------------------------

    //connect socket -> check for onboarding -> set ready true

    useEffect(() => {
        connectSocket()
        socket.subscribe("onclose", disconnect, false, "onclose");
        socket.subscribe("game_not_running", gameClosed, false)
    }, [])

    useEffect(() => {
        if (connected && !ready) {
            getStates()
        }
    }, [connected])

    useEffect(() => {
        console.log("checking if ready")
        if (gameRunning) {
            console.log("ready")
            setReady(true)
        }
    }, [onboardingCompleted, gameRunning])

    useEffect(() => {
        checkVersion()
    }, [ServerVersion])

    function stopLoading(success) {
        setShowLoad(false)
        setTimeout(() => {
            setLoading(false);
        }, 300)
    }

    function gameStarted() {
        setTimeout(() => {
            setGameRunning(true)
            setTimeout(() => {
                setErrorPage(null)
            }, 1000)
        }, 500)
    }

    function checkVersion(){
        if(ServerVersion !== "" && Config.VERSION_CHECK_ENABLED){
            if(!Config.SERVER_VERSION_COMPATABILITY.includes(ServerVersion)){
                setErrorPage(<WrongVersion />)
            } else {
                console.log("version matches")
            }
        }
    }

    async function connectSocket() {

        //reset all states
        setLoading(true);
        setShowLoad(true);
        setReady(false);
        setConnected(false);
        setErrorPage(null);
        setOnboardingCompleted(false);
        setGameRunning(false)

        socket.connect()
            .then((response) => {
                console.log("done")
                setConnected(true);
                stopLoading();
            })
            .catch(() => {
                console.log("caught something")
                setConnected(false);
                stopLoading();
                setErrorPage(<ConnectionFailed retry={connectSocket} />)
            })

    }

    function getStates() {
        function onboardingCallback(response) {
            if (Config.BYPASS_ONBOARDING === false) {
                console.log(`onboarded: ${response}`)
                setOnboardingCompleted(response);
            } else {
                setOnboardingCompleted(true)
            }
        }
        socket.request({ "request": "get_onboarding_state" }, onboardingCallback)

        function gameRunningCallback(response) {
            console.log(`game running: ${response}`)
            setGameRunning(response)
            if (response === false) {
                setErrorPage(<GameNotRunning callback={gameStarted} />)
            }
        }
        socket.request({ "request": "get_running_state" }, gameRunningCallback)

        function serverVersionCallback(response) {
            console.log(`server version: ${response}`)
            console.log(`client version: ${Config.FRONTEND_VERSION}`)
            setVersion(response)
            checkVersion()
        }
        socket.request({ "request": "get_server_version" }, serverVersionCallback)
    }


    function startupLoading() {
        if (isLoading) {
            return (<WebsocketHandshake open={showLoad} />)
        }
    }

    function disconnect() {
        console.log("disconnected")
        setConnected(false);
        setReady(false)
        setErrorPage(<ConnectionFailed retry={connectSocket} />)
    }

    function gameClosed() {
        setGameRunning(false)
        setReady(false)
        setErrorPage(<GameNotRunning callback={gameStarted} />)
    }

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

            {errorPage}

            {startupLoading()}

            {ready ?
                <HashRouter basename="/">
                    <Route exact path="/">
                        {onboardingCompleted ? <Redirect to="/collection" /> : <Redirect to="/onboarding" />}
                    </Route>
                    <Route path="/onboarding"> 
                        <Onboarding />
                    </Route>

                    <Route path="/collection">
                        {Config.ENABLED_PAGES.collection === true ? <CollectionHome /> : <Redirect to="/" />}
                    </Route>
                    <Route path="/buddies">
                        {Config.ENABLED_PAGES.buddies === true ? <BuddiesHome /> : <Redirect to="/" />}
                    </Route>
                </HashRouter>
                
                : null}


        </ThemeProvider>
    );
}

export default App;