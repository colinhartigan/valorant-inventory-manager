import React from 'react';

//utilities
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Switch, Route, HashRouter, Redirect } from "react-router-dom";
import io from 'socket.io-client';


//pages
import Home from './pages/Home'

const darkTheme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#fa4454',
        },
        secondary: {
            main: '#ffffff',
        },
    },
})

class App extends React.Component {

    // WEBSOCKETS MAKE ME WANT TO KILL MYSELF
    //----------------------------------------------------------------------------------
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <ThemeProvider theme={darkTheme}>
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
}


export default App;