import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Typography, Divider, Select, InputLabel, MenuItem, FormControl, Switch, Container, IconButton, TextField, Fade } from '@mui/material'

//icons 
import { Close, SettingsInputAntenna } from '@mui/icons-material'

import socket from "../../services/Socket";
import { useConfig } from '../../services/useConfig';

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
        margin: "0px 20px 10px 20px",
        backgroundColor: "transparent",
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

function ConfigItem(props) {

    const classes = useStyles();
    const theme = useTheme();

    const config = props.config;
    const updateConfig = props.updateConfig
    const section = props.section

    const key = props.itemKey;
    const data = props.data;

    const [value, setValue] = useState(data.value);
    const [saving, setSaving] = useState(false);

    function generateInteraction() {
        if (data.attrs === undefined) {
            data.attrs = [];
        }
        switch (data.type) {
            case "bool":

                function toggle(event) {
                    setValue(event.target.checked);
                    config[section].settings[key].value = event.target.checked;
                    updateConfig({ ...config })
                }

                return (
                    <Switch color="primary" checked={value} onClick={toggle} disabled={data.attrs.includes("locked")} />
                )

            case "list_selection":
                return (
                    <FormControl style={{ width: "100%" }}>
                        <InputLabel id={key} style={{ width: "100%", }}>{data.display}</InputLabel>
                        <Select
                            value={value}
                            onChange={(event) => {
                                setValue(event.target.value);
                                config[section].settings[key].value = event.target.value;
                                updateConfig({ ...config })
                            }}
                            disabled={data.attrs.includes("locked")}
                        >
                            {data.options.map((option, index) => {
                                return (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                )

            case "string":
                return (
                    <div className={classes.selector} style={{ width: "35%", marginLeft: "2%" }}>
                        <TextField
                            id={key}
                            label={data.display}
                            defaultValue={data.value}
                            disabled={data.attrs.includes("locked")}
                            onChange={(event) => {
                                setValue(event.target.value);
                                config[section].settings[key].value = event.target.value;
                                updateConfig({ ...config })
                            }}
                            variant="standard"
                            style={{ width: "100%", }}
                        />
                    </div>
                )

            default:
                return (null)
        }
    }

    return (
        <div className={classes.variable}>
            <div className={classes.descriptor}>
                <Typography variant="subtitle1" className={classes.variableName} style={{ height: (data.description !== undefined ? "auto" : "100%"), lineHeight: 1.5, margin: "auto", marginBottom: "5px" }}>{data.display !== undefined ? data.display : key}</Typography>

                {data.description !== undefined ?
                    <Typography variant="body1" style={{ marginLeft: "20px", }}>{data.description}</Typography>
                    : null
                }
            </div>
            <div className={classes.selector}>
                {generateInteraction()}
            </div>
        </div>
    )
}


function Config(props) {
    const classes = useStyles();
    const theme = useTheme();

    const [config, updateConfig, publishConfig] = useConfig();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        console.log(config)
        setSaving(false);
    }, [config])

    useEffect(() => {
        if (props.saveTrigger === true) {
            saveAndClose()
        }
    }, [props.saveTrigger])

    function generateSection(section, sectionData) {
        console.log(sectionData)
        return (
            <Fade in>
                <div className={classes.section}>
                    <Typography variant="h6" className={classes.sectionHeader}>{sectionData.display}</Typography>

                    {Object.keys(sectionData.settings).map(key => {
                        var data = sectionData.settings[key]
                        return (<ConfigItem key={key} itemKey={key} data={data} config={config} updateConfig={updateConfig} section={section} />);
                    })}

                    <Divider style={{ margin: "10px 10px" }} />
                </div>
            </Fade>
        )
    }

    function generateVisuals() {
        return (
            <Container maxWidth="lg" className={classes.body}>
                {Object.keys(config).map(section => {
                    var sectionData = config[section];
                    return generateSection(section, sectionData);
                })}
            </Container>
        )
    }

    function saveAndClose() {
        console.log("saving")
        setSaving(true);
        publishConfig(() => { props.close(false) });
    }

    return <>
        {config !== null ?
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
                            onClick={saveAndClose}
                            disabled={config === null || saving}
                            size="large">
                            <Close />
                        </IconButton>
                    </div>
                    : null}

                {config !== null ? generateVisuals() : null}
            </div>
        : null }
    </>;
}

export default Config;