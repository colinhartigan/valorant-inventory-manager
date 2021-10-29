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

    const [selectedChromaIndex, setSelectedChroma] = useState(props.equippedChromaIndex.toString())

    function handleChromaChange(event, newLevel) {
        if (newLevel !== null){
            setSelectedChroma(newLevel);
            var chromaData = Object.values(props.chromaData)[newLevel-1]
            props.setter(chromaData)
        }
        
    }

    useEffect(() => {
        setSelectedChroma(props.equippedChromaIndex.toString())
    }, [props.equippedChromaIndex])

    return (
        <div style={{ width: "50%", display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <ToggleButtonGroup
                value={selectedChromaIndex}
                exclusive
                onChange={handleChromaChange}
                aria-label="skin level"
                style={{ width: "90%", height: "95%", justifyContent: "flex-end", marginLeft: 0}}
            >

                {Object.keys(props.chromaData).map(uuid => {
                    var data = props.chromaData[uuid]
                    var index = data.index.toString()
                    if (data.swatch_icon !== null){
                        return (
                            <Tooltip title={data.unlocked ? data.display_name : `${data.display_name} (Locked)`} arrow>
                                <ToggleButton selected={selectedChromaIndex === index} value={index} aria-label={data.index} disabled={!data.unlocked}>
                                    <img src={data.swatch_icon} style={{ width: "25px", height: "auto", filter: !data.unlocked ? "grayscale(75%)" : ""}} />
                                </ToggleButton>
                            </Tooltip>
                        )
                    }else{
                        return null
                    }
                            
            })}
            </ToggleButtonGroup>
        </div>
    )
}

export default ChromaSelector;