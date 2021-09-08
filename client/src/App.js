import React from 'react';
import { useEffect, useState } from 'react';
import Loader from "react-loader-spinner";
import AnimatedCursor from "react-animated-cursor"

//utilities
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Switch, Route, HashRouter, Redirect } from "react-router-dom";
import io from 'socket.io-client';


//pages
import Home from './pages/Home'

const darkTheme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#fa4454',
        },
        secondary: {
            main: '#ffffff',
        },
    },
})

function App(props) {
    const [ isLoading, setLoading ] = useState(true);

    // WEBSOCKETS MAKE ME WANT TO KILL MYSELF
    //----------------------------------------------------------------------------------

    useEffect(() => {
        setLoading(false);
    }, [])

    return (
        <React.Fragment>
            <ThemeProvider theme={darkTheme}>
                <Loader
                    type="TailSpin"
                    color="#000"
                    height={128}
                    width={128}
                    visible={isLoading}
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#fff',
                        zindex: '10000',
                    }}
                />
                <AnimatedCursor
                    color="0, 0, 0"
                    innerSize={16}
                    outerSize={24}
                    outerScale={2.5}
                    trailingSpeed={4}
                />
                <CssBaseline />
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
            </ThemeProvider>
        </React.Fragment>
    );
}


export default App;