import React from 'react';

//utilities
import { withStyles } from '@material-ui/core/styles';

//components
import { Grid, Container, Typography, Paper, Fade } from '@material-ui/core'
import video from './sample.mp4';

const stockImageSize = "250px";
const scaleOverrides = {
    "29a0cfab-485b-f5d5-779a-b59f85e204a8": "115px", //classic
    "42da8ccc-40d5-affc-beec-15aa47b42eda": "150px", //shorty
    "44d4e95c-4157-0037-81b2-17841bf2e8e3": "105px", //frenzy
    "1baa85b4-4c70-1284-64bb-6481dfc3bb4e": "150px", //ghost
    "e336c6b8-418d-9340-d77f-7a9e4cfe0702": "140px", //sheriff

    "f7e1b454-4ad4-1063-ec0a-159e56b58941": "190px", //stinger
    "462080d1-4035-2937-7c09-27aa2a5c27a7": "195px", //spectre

    "ae3de142-4d85-2547-dd26-4e90bed35cf7": "240px", //bulldog

    "55d8a0f4-4274-ca67-fe2c-06ab45efdf58": "260px", //ares
    "63e6c2b6-4a8e-869c-3d4c-e38355226584": "270px", //odin

    "2f59173c-4bed-b6c3-2191-dea9b58be9c7": "150px", //melee
}

const styles = theme => ({

    weaponContainer: {
        display: "flex",
        minWidth: "100%",
        height: "100%",
        padding: theme.spacing(.5),
        transition: "0.1s ease-out !important",
        "&:hover": {
            transform: "scale(1.025)",
        },
        "&:active": {
            transform: "scale(0.9)",
        }
    },

    weaponContainerVideo: {
        position: "absolute",
        objectFit: "cover",
        width: "auto",
        height: "auto",
    },

    weaponPaper: {
        display: "flex",
        width: "100%",
        maxHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "0.1s ease-out",
        "&:hover": {
            border: "1px #000 solid"
        },
    },

    textGrid: {
        display: "flex",
        textAlign: "left",
        width: "90%",
        alignSelf: "flex-end"
    },

    weaponLabel: {
        fontFamily: "tungsten-bold",
        fontSize: "1.5rem",
        lineHeight: "1.5em",
        display: "flex",
        textAlign: "left",
        width: "90%",
        height: "auto",
        alignSelf: "flex-end"
    }

});


function HoverVideo(props) {
    return (
        <div style={{ position: "absolute", objectFit: "fill", }}>
            <video width="256px" height="96px" autoplay muted loop>
                <source src="https://media.valorant-api.com/streamedvideos/release-03.04/72c8af91-f9f9-4044-801c-3e73ee2f2aa1.mp4" type="video/mp4" />
            </video>
        </div>
    );
}

class Weapon extends React.Component {

    nextData = null;
    db = false;

    constructor(props) {
        super(props);
        this.state = { "updating": false, "data": null };
    }

    componentDidMount() {

    }

    componentDidUpdate(nextProps) {
        if (nextProps.data !== undefined) {
            var comparisonTarget = this.state.data !== null ? this.state.data.chroma_uuid : ""
            if (this.db === false && nextProps.data.chroma_uuid !== comparisonTarget) {
                this.db = true
                setTimeout(() => {
                    this.setState({ "updating": true });
                    setTimeout(() => {
                        this.setState({ "updating": true, "data": nextProps.data });
                        setTimeout(() => {
                            this.setState({ "updating": false });
                            this.db = false;
                        }, this.randomTimer());
                    }, this.randomTimer())
                }, this.randomTimer());
            }
        }
    }

    randomTimer() {
        return ((Math.random() * 400) + 200);
    }

    render() {
        const { classes } = this.props;
        return (
            <Fade in={!this.state.updating}>
                <Container className={classes.weaponContainer}>
                    <Paper className={classes.weaponPaper} variant="outlined" style={{ backgroundImage: this.state.data != null ? `url(${this.state.data.image})` : `url("https://media.valorant-api.com/weapons/${this.props.uuid}/displayicon.png")`, backgroundSize: `${this.props.uuid in scaleOverrides ? scaleOverrides[this.props.uuid] : stockImageSize} auto` }}>
                        <Typography className={classes.weaponLabel} variant="overline">{this.props.displayName}</Typography>
                    </Paper>
                </Container>
            </Fade>
        )
    }
}

export default withStyles(styles)(Weapon)