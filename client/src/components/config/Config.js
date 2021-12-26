import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Typography, Divider, Select, InputLabel, MenuItem, FormControl, Switch, TextField, IconButton } from '@material-ui/core'

//icons 
import { Close } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({

    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifySelf: "flex-start",
        justifyContent: "center",
        alignContent: "flex-start",
        flexWrap: "wrap",
        overflow: "auto",
    },

    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        width: "100%",
        height: "50px",
        margin: "10px 20px 10px 20px",
    },

    closeButton: {
        width: "40px",
        height: "40px",
        alignSelf: "center", 
        justifySelf: "flex-end",
        marginRight: "0px",
    },

    body: {
        width: "92%",
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        justifyContent: "flex-start",
    },

    section: {
        width: "98%",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignSelf: "center",
        marginBottom: "10px",
    },

    sectionHeader: {
        marginBottom: "10px",
        fontSize: "1.5rem",
    },

    variable: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        marginBottom: "10px",
    },

    variableName: {
        fontSize: "1.2rem",
    },

    descriptor: {
        width: "75%",
    },

    selector: {
        width: "25%",
        display: "flex",
        flexDirection: "row",
        justifySelf: "flex-end",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    }

}))

function Config(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [config, updateConfig] = useState(null);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h4" style={{ color: theme.palette.primary.light, fontSize: "2.2rem", flexGrow: 1, margin: "auto" }}>Settings</Typography>
                <IconButton
                    aria-label="randomize"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    edge="end"
                    color="inherit"
                    className={classes.closeButton}
                    onClick={() => props.close(false)}
                >
                    <Close />
                </IconButton>
            </div>

            <div className={classes.body}>
                <div className={classes.section}>
                    <Typography variant="h6" className={classes.sectionHeader}>VALORANT Client Settings</Typography>

                    <div className={classes.variable}>
                        <div className={classes.descriptor}>
                            <Typography variant="subtitle1" className={classes.variableName}>Sample list select</Typography>
                            <Typography variant="body1">this is a descriptive description</Typography>
                        </div>
                        <div className={classes.selector}>
                            <FormControl style={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-label" style={{ width: "100%", }}>List</InputLabel>
                                <Select>
                                    <MenuItem value={null}>NA</MenuItem>
                                    <MenuItem value={null}>EU</MenuItem>
                                    <MenuItem value={null}>KR</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className={classes.variable}>
                        <div className={classes.descriptor}>
                            <Typography variant="subtitle1" className={classes.variableName}>Sample toggle</Typography>
                            <Typography variant="body1">this is a descriptive description, but slightly longer</Typography>
                        </div>
                        <div className={classes.selector}>
                            <Switch color="primary" />
                        </div>
                    </div>

                    <div className={classes.variable}>
                        <div className={classes.descriptor} style={{ width: "63%" }}>
                            <Typography variant="subtitle1" className={classes.variableName}>Sample entry</Typography>
                            <Typography variant="body1">notice how the text entry is slightly wider than the other things</Typography>
                        </div>
                        <div className={classes.selector} style={{ width: "35%", marginLeft: "2%" }}>
                            <TextField id="outlined-basic" label="Entry" variant="standard" style={{ width: "100%", }} />
                        </div>
                    </div>

                </div>

                <Divider variant="middle" />
            </div>
        </div>
    )
}

export default Config;