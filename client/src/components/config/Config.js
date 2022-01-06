import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Typography, Divider, Select, InputLabel, MenuItem, FormControl, Switch, Container, IconButton } from '@material-ui/core'

//icons 
import { Close } from '@material-ui/icons'

import socket from "../../services/Socket";

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
        "&::-webkit-scrollbar": {
            width: 4,
        },
        "&::-webkit-scrollbar-track": {
            boxShadow: `inset 0 0 6px rgba(0, 0, 0, 0.3)`,
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            outline: `1px solid slategrey`,
            backgroundClip: "padding-box",
        },
    },

    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        width: "100%",
        height: "75px",
        margin: "0px 20px 0px 20px",
        backgroundColor: "#424242",
        paddingTop: "0px",
        position: "sticky",
        top: 0,
        zIndex: 3,
    },

    closeButton: {
        width: "40px",
        height: "40px",
        alignSelf: "center",
        justifySelf: "flex-end",
        marginRight: "0px",
    },

    body: {
        width: "95%",
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        justifyContent: "flex-start",
        overflowY: "auto",
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
        marginBottom: "8px",
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
        flexGrow: 1,
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

    useEffect(() => {
        console.log("mounted")
        fetchConfig();
    }, [])

    function fetchConfig() {
        function callback(response) {
            console.log(response)
            updateConfig(response);
        }
        socket.request({ "request": "fetch_config" }, callback);
    }

    function generateInteraction(key, data) {
        if (data.attrs === undefined) {
            data.attrs = [];
        }
        switch (data.type) {
            case "bool":

                function toggle(event) {
                    data.value = event.target.checked;
                    console.log(config)
                    updateConfig(config);
                }

                return (
                    <Switch color="primary" checked={data.value} onClick={toggle} disabled={data.attrs.includes("locked")} />
                )

            case "list_selection":
                return (
                    <FormControl style={{ width: "100%" }}>
                        <InputLabel id={key} style={{ width: "100%", }}>{data.display}</InputLabel>
                        <Select
                            value={data.value}
                        >
                            {data.options.map((option, index) => {
                                return(
                                    <MenuItem value={index}>{option}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                )

            // text entry

            default:
                return (null)
        }
    }

    function generateSetting(key, settingData) {
        return (
            <div className={classes.variable}>
                <div className={classes.descriptor}>
                    <Typography variant="subtitle1" className={classes.variableName} style={{ height: (settingData.description !== undefined ? "auto" : "100%") }}>{settingData.display !== undefined ? settingData.display : key}</Typography>

                    {settingData.description !== undefined ?
                        <Typography variant="body1" style={{ marginLeft: "20px", }}>{settingData.description}</Typography>
                        : null
                    }
                </div>
                <div className={classes.selector}>
                    {generateInteraction(key, settingData)}
                </div>
            </div>
        )
    }

    function generateSection(sectionData) {
        return (
            <div className={classes.section}>
                <Typography variant="h6" className={classes.sectionHeader}>{sectionData.display}</Typography>

                {Object.keys(sectionData.settings).map(key => {
                    var data = sectionData.settings[key]
                    return generateSetting(key, data);
                })}

                <Divider style={{ margin: "10px 10px" }} />
            </div>
        )
    }

    function generateVisuals() {
        return (
            <Container maxWidth="xl" className={classes.body}>
                {Object.keys(config).map(section => {
                    var sectionData = config[section];
                    return generateSection(sectionData);
                })}
            </Container>
        )
    }

    return (
        <div className={classes.root}>
            {props.showHeader ? 
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
            : null}

            {config !== null ? generateVisuals() : null}
            {/* <div className={classes.body}>
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
            </div> */}
        </div>
    )
}

export default Config;