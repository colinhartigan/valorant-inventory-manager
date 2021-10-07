import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Tooltip, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({

}));


function ChromaSelector(props) {

    const classes = useStyles();

    return (
        <div style={{ width: "50%", display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <ToggleButtonGroup
                value={props.equippedChromaUuid}
                exclusive
                onChange={null}
                aria-label="skin level"
                style={{ width: "90%", height: "95%", justifyContent: "flex-end", marginLeft: 0}}
            >

                {Object.keys(props.chromaData).map(uuid => {
                    var data = props.chromaData[uuid]
                    return (
                        <Tooltip title={data.unlocked ? data.display_name : `${data.display_name} (Locked)`} arrow>
                            <ToggleButton value={data.uuid}>
                                <img src={data.swatch_icon} style={{ width: "25px", height: "auto", filter: (!data.unlocked ? "brightness('50%')" : "brightness('100%')") }} />
                            </ToggleButton>
                        </Tooltip>
                    )
                            
            })}
            </ToggleButtonGroup>
        </div>
    )
}

export default ChromaSelector;