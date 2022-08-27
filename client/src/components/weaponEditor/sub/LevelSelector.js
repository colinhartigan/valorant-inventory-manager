import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Tooltip, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { Check } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({


}));


function LevelSelector(props) {

    const classes = useStyles();
    const theme = useTheme();

    const selectedChromaIndex = props.selectedChromaIndex;
    const selectedSkinIsEquipped = props.selectedSkinIsEquipped
    const equippedLevelIndex = props.equippedLevelIndex.toString()
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
        console.log(equippedLevelIndex)
        return (
            <div style={{ flexGrow: 1, width: "50%", display: "flex", flexDirection: "row", justifyContent: "flex-start", height: "45px", }}>
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
                        var equipped = index === equippedLevelIndex && selectedSkinIsEquipped 

                        return (
                            <Tooltip key={data.display_name} title={data.unlocked ? (data.favorite ? `Favorited - ${data.level_type}` : data.level_type) : `${data.level_type} (Locked)`} arrow>
                                <ToggleButton selected={selectedLevel === index} value={index} aria-label={data.index} style={{ border: (data.favorite ? `1px #996D2D solid` : null) }}>
                                    <Typography variant="body" style={{zIndex: 1, color: (equipped && selectedLevel === index ? "rgba(255,255,255,.8)" : null)}}>{data.shorthand_display_name}</Typography>

                                    {equipped ? <Check style={{ width: "auto", height: "25px", position: "absolute", bottom: "", objectFit: "contain", alignSelf: "flex-end", margin: "auto", color: "#66bb6a", zIndex: 2}} /> : null}

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