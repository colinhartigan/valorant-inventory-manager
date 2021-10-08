import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles } from '@material-ui/core/styles';

//components
import { Tooltip, Container, Typography, Toolbar, IconButton, Slide, AppBar } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({


}));


function LevelSelector(props) {

    const classes = useStyles();

    const [selectedLevel, setSelectedLevel] = useState(props.equippedLevelIndex.toString());

    function handleLevelChange(event, newLevel) {
        if (newLevel !== null){
            setSelectedLevel(newLevel);
            var levelData = Object.values(props.levelData)[newLevel-1]
            props.setter(levelData)
        }
        
    }

    return (
        <div style={{ width: "50%", display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>

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
                        <Tooltip title={data.level_type} arrow>
                            <ToggleButton selected={selectedLevel===index} value={index} aria-label={data.index} disabled={!data.unlocked}>
                                {data.shorthand_display_name}
                            </ToggleButton>
                        </Tooltip>
                    )
                })}

                {/* <Tooltip title="VFX" arrow>
                    <ToggleButton value="2" aria-label="level 2">
                        LVL2
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Animation" arrow>
                    <ToggleButton value="3" aria-label="level 3">
                        LVL3
                    </ToggleButton>
                </Tooltip>

                <Tooltip title="Finisher" arrow>
                    <ToggleButton value="4" selected aria-label="level 4">
                        LVL4
                    </ToggleButton>
                </Tooltip> */}

               
            </ToggleButtonGroup>

        </div>
    )
}

export default LevelSelector