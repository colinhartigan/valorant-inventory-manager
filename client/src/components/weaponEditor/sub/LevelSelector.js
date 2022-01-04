import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Tooltip, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({


}));


function LevelSelector(props) {

    const classes = useStyles();
    const theme = useTheme();

    const selectedChromaIndex = props.selectedChromaIndex;
    const maxLevel = Object.keys(props.levelData).length.toString();

    const [selectedLevel, setSelectedLevel] = useState(props.selectedLevelIndex.toString());

    function handleLevelChange(event, newLevel) {
        if (newLevel !== null) {
            setSelectedLevel(newLevel);
            var levelData = Object.values(props.levelData)[newLevel - 1]
            props.setter(levelData)
        }
    }

    useEffect(() => {
        if (selectedChromaIndex !== 1 && selectedLevel !== maxLevel) {
            setSelectedLevel(maxLevel);
            var levelData = Object.values(props.levelData)[maxLevel - 1]
            props.setter(levelData)
        }
    }, [selectedChromaIndex])

    useEffect(() => {
        setSelectedLevel(props.selectedLevelIndex.toString())
    }, [props.selectedLevelIndex])

    if (maxLevel !== "1"){
        return (
            <div style={{ width: "50%", display: "flex", flexDirection: "row", justifyContent: "flex-start", height: "45px", }}>

                <ToggleButtonGroup
                    value={selectedLevel}
                    exclusive
                    onChange={handleLevelChange}
                    aria-label="chroma level"
                    style={{ width: "90%", height: "95%" }}
                >
                    {Object.keys(props.levelData).map(uuid => {
                        var data = props.levelData[uuid]
                        var index = data.index.toString();
                        return (
                            <Tooltip key={data.display_name} title={data.level_type} disabled={!data.unlocked || (!(selectedChromaIndex === 1 && index !== 1) && index !== maxLevel)} arrow>
                                <ToggleButton selected={selectedLevel === index} value={index} aria-label={data.index} style={{ border: (data.favorite ? `1px #996D2D solid` : null) }}>
                                    {data.shorthand_display_name}
                                </ToggleButton>
                            </Tooltip>
                        )
                    })}

                </ToggleButtonGroup>

            </div>
        )
    } else {
        return null
    }
}

export default LevelSelector