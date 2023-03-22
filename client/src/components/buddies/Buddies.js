import { React, useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js'

//utilities
import { useTheme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

//components
import { Button, Grid, InputBase } from '@mui/material';

//icons
import { Search } from '@mui/icons-material'

import BuddyItem from './sub/BuddyItem.js'
import BuddyEditor from '../buddyEditor/BuddyEditor.js'

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },

    gridContainer: {
        height: "auto",
        width: "100%",
        overflowY: "auto",
        flexGrow: 1,
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

    mainGrid: {
        maxHeight: "100%",
        width: "99%",
    },

    serachContainer: {
        height: "60px",
        padding: "10px 0px",
        marginLeft: "12px",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },

    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        width: '300px',
        backgroundColor: "#565656"
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: "100%"
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));

function Buddies(props) {

    const classes = useStyles();
    const theme = useTheme();

    const loadout = props.loadout
    const inventory = props.inventory
    const editorCallback = props.buddyEditorCallback
    const favoriteCallback = props.favoriteCallback
    const favoriteAllCallback = props.favoriteAllCallback

    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState([])

    const [renderBuddies, setRenderBuddies] = useState(false)

    const [fuse, setFuse] = useState(null)

    const searchBank = []

    useEffect(() => {
        for (const item in inventory) {
            var data = inventory[item]
            searchBank.push(data.display_name)
        }
        setFuse(new Fuse(searchBank, { threshold: 0.4 }))
    }, [inventory])

    useEffect(() => {
        if (fuse !== null) {
            const results = fuse.search(searchTerm)
            var matches = []
            for (const item in results) {
                matches.push(results[item].item)
            }
            setSearchResults(matches)
        }
    }, [searchTerm])

    useEffect(() => {
        setTimeout(() => {
            setRenderBuddies(true);
        }, 1) //1ms delay to prevent lag when clicking on buddies page button
    }, [])


    function updateBuddyFavorite(uuid, favorite) {
        var buddyData = inventory[uuid]
        Object.keys(buddyData.instances).forEach(key => {
            var data = buddyData.instances[key]
            console.log(data)
            if (!data.locked) {
                data.favorite = favorite
            }
        })
        favoriteCallback(uuid, buddyData)
    }

    function favoriteAll(fave) {
        favoriteAllCallback(fave)
    }


    return (
        <div className={classes.root}>

            <div className={classes.serachContainer}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <Search />
                    </div>
                    <InputBase
                        placeholder="Search"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={(event) => { setSearchTerm(event.target.value) }}
                    />
                </div>

                <div style={{ width: "auto", height: "60px", marginLeft: "10px", display: "flex", flexDirection: "row", justifyContent: "flex", alignItems: "center" }}>
                    <Button variant="contained" disableElevation color="secondary" onClick={() => { favoriteAll(true) }} style={{ margin: "5px" }}>Favorite all</Button>
                    <Button variant="contained" disableElevation color="secondary" onClick={() => { favoriteAll(false) }} style={{ margin: "5px" }}>Unfavorite all</Button>
                </div>
            </div>

            <div className={classes.gridContainer}>
                <Grid container className={classes.mainGrid} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    {inventory !== undefined && renderBuddies ? Object.keys(inventory).map((key) => {
                        var data = inventory[key]

                        return (
                            searchResults.includes(data.display_name) || searchResults.length === 0 ?
                                <Grid item p={1.5} key={data.display_name} xl={3} lg={4} md={6} sm={12} xs={12}>
                                    <BuddyItem data={data} loadout={loadout} buddyEditorCallback={editorCallback} favoriteCallback={updateBuddyFavorite} />
                                </Grid>
                                : null
                        )
                    }) : null}

                </Grid>
            </div>
        </div>
    )

}

export default Buddies;