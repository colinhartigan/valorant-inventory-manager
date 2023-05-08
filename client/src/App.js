import { useEffect, useState, useRef } from "react";

//utilities
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Switch, Route, HashRouter, Redirect } from "react-router-dom";
import useLocalStorage from "./services/useLocalStorage";
import { Config, setVersion, ServerVersion } from "./services/ClientConfig"

import socket from "./services/Socket";

import { useLoadoutRunner } from "./services/useLoadout.js";
import { useInventoryRunner } from "./services/useInventory.js"
import { useConfigRunner } from "./services/useConfig";
import { useProfilesRunner } from "./services/useProfiles";


//pages
import CollectionHome from "./pages/CollectionHome"
import LoadoutsHome from "./pages/LoadoutsHome"
import BuddiesHome from "./pages/BuddiesHome"
import Onboarding from "./pages/Onboarding"
import About from "./pages/About"
import Statistics from "./pages/Statistics"

//components
import NavBar from './components/misc/Navigation'
import Header from './components/misc/Header.js'
import Footer from './components/misc/Footer.js'

//error pages
import ConnectionFailed from "./components/errors/ConnectionFailed.js"
import GameNotRunning from "./components/errors/GameNotRunning.js"
import WrongVersion from "./components/errors/WrongVersion.js"

//components
import WebsocketHandshake from "./components/misc/WebsocketHandshake";

const mainTheme = createTheme({
    palette: {
        mode: "dark",
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

    const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage("onboardingCompleted", false);
    const [gameRunning, setGameRunning] = useState(false);

    const [ready, setReady] = useState(false);
    const [awaitingStates, setAwaitingStates] = useState(false);

    const [errorPage, setErrorPage] = useState(null);

    const [config, activateConfig] = useConfigRunner();

    // WEBSOCKETS MAKE ME WANT TO KILL MYSELF (9/6/2021)
    //----------------------------------------------------------------------------------

    //connect socket -> check for onboarding -> set ready true

    useEffect(() => {
        socket.subscribe("onclose", disconnect, false, "onclose");
        socket.subscribe("game_not_running", gameClosed, false)
        socket.subscribe("start_game", gameOpened, false)
        console.log("onboarding", onboardingCompleted)
        startup();
    }, [])

    useEffect(() => {
        if (errorPage !== null) {
            setLoading(false)
        }
    })

    useEffect(() => {
        checkVersion()
    }, [ServerVersion])

    useEffect(() => {
        if (awaitingStates) {
            if (gameRunning) {
                forceRefreshInventory()
                stopLoading();
                setReady(true)
                setAwaitingStates(false);
                activateConfig();
                console.log("ready")
            }
        }
    }, [onboardingCompleted, gameRunning])

    function startup() {
        //reset all states
        setLoading(true);
        setReady(false);
        setConnected(false);
        setErrorPage(null);
        setGameRunning(false)

        console.log("awaiting socket")
        connectSocket()
            .then(() => {
                setAwaitingStates(true)
                getStates();
                console.log("awaing states for ready")
            });

    }

    function forceRefreshInventory() {
        socket.send({ "request": "refresh_buddy_inventory" })
        socket.send({ "request": "refresh_skin_inventory" })
        socket.send({ "request": "refresh_profiles" })
    }

    function stopLoading() {
        setTimeout(() => {
            setLoading(false);
        }, 300)
    }

    function gameOpened(response) {
        console.log("game opened", response)
        if (response === true) {
            startup();
        }
    }

    function checkVersion() {
        if (ServerVersion !== "" && Config.VERSION_CHECK_ENABLED) {
            if (!Config.SERVER_VERSION_COMPATABILITY.includes(ServerVersion)) {
                setErrorPage(<WrongVersion />)
            } else {
                console.log("version matches")
            }
        }
    }

    async function connectSocket() {
        return new Promise((resolve, reject) => {
            console.log("asdf")
            socket.connect()
                .then((response) => {
                    console.log("socket connected")
                    setConnected(true);
                    return resolve();
                })
                .catch(() => {
                    console.log("caught something")
                    setConnected(false);
                    setErrorPage(<ConnectionFailed retry={startup} />)
                    return reject();
                })
        });
    }

    function getStates() {

        function gameRunningCallback(response) {
            console.log(`game running: ${response}`)
            setGameRunning(response)
            if (response === false) {
                setErrorPage(<GameNotRunning />)
            }
        }
        socket.request({ "request": "get_running_state" }, gameRunningCallback)

        function serverVersionCallback(response) {
            console.log(`server version: ${response}`)
            console.log(`client version: ${Config.FRONTEND_VERSION}`)
            setVersion(response)
            checkVersion();
        }
        socket.request({ "request": "get_server_version" }, serverVersionCallback)
    }


    function startupLoading() {
        if (isLoading) {
            return (<WebsocketHandshake open />)
        }
    }

    function disconnect() {
        console.log("disconnected")
        setConnected(false);
        setReady(false)
        setErrorPage(<ConnectionFailed retry={startup} />)
    }

    function gameClosed() {
        setGameRunning(false)
        setReady(false)
        setErrorPage(<GameNotRunning />)
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mainTheme}>
                <CssBaseline />
                {/* <AnimatedCursor
                    color="255,255,255"
                    innerSize={12}
                    outerSize={18}
                    outerScale={1.5}
                    trailingSpeed={4}
                /> */}
                {Config.TEST_BUILD ?
                    <div style={{ width: "100vw", height: "100vh", zIndex: 2000, border: ".2rem solid red", position: "absolute", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", pointerEvents: "none" }}>
                        <Typography variant="body1" sx={{ background: "red", padding: "5px" }}>VIM TEST BUILD</Typography>
                    </div>
                    : null}
                {errorPage}

                {startupLoading()}

                {ready ?
                    <HashRouter basename="/">
                        <Route exact path="/">
                            {onboardingCompleted ? <Redirect to="/vim" /> : <Redirect to="/onboarding" />}
                        </Route>
                        <Route path="/onboarding">
                            <Onboarding />
                        </Route>

                        <Route path="/vim">
                            <VIMmain />
                        </Route>
                    </HashRouter>

                    : null}


            </ThemeProvider>
        </StyledEngineProvider>
    );
}

function VIMmain(props) {
    const [target, setTarget] = useLocalStorage("lastVisitedPage", "collection")

    //global states
    const [profile] = useProfilesRunner();
    const [loadout] = useLoadoutRunner();
    const [inv] = useInventoryRunner();

    const routes = {
        "collection": Config.ENABLED_PAGES.collection === true ? <CollectionHome /> : <Redirect to="/" />,
        "buddies": Config.ENABLED_PAGES.buddies === true ? <BuddiesHome /> : <Redirect to="/" />,
        "loadouts": Config.ENABLED_PAGES.loadouts === true ? <LoadoutsHome /> : <Redirect to="/" />,

        "statistics": <Statistics />,
        "about": <About />,
    }

    return (
        <>
            <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "row", overflow: "auto" }}>
                <NavBar setTarget={setTarget} />
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                    <Header />
                    {routes[target]}
                    <Footer />
                </div>
            </div>

        </>
    )
}

export default App;