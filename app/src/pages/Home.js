import React from 'react';

//utilities
import { withStyles } from '@material-ui/core/styles';

//components
import Collection from '../components/Collection.js'
import { Grid, Container, Typography } from '@material-ui/core'


const styles = theme => ({
    root: {
        display: "flex",
        margin: "auto",
    },
});


class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = 'valorant-skin-manager / home'
    }

    
    render() {
        const { classes } = this.props;
        return (
            <Container className={classes.root} alignItems="center">
                <Collection />
            </Container>
        )
    }
}


export default withStyles(styles)(Home)