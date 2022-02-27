import { React, useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js'

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Grid, InputBase } from '@material-ui/core';

//icons
import { Search } from '@material-ui/icons'

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
        height: "calc(100% - 70px)",
        width: "100%",
        overflowY: "auto",
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
        width: "100%",
    },

    serachContainer: {
        height: "60px",
        marginBottom: "10px",
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
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        width: '100%',
    },
}));

function Buddies(props) {

    const classes = useStyles();
    const theme = useTheme();

    const loadout = props.loadout
    const inventory = props.inventory

    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState([])

    const [fuse, setFuse] = useState(null)

    const searchBank = []

    useEffect(() => {
        for (const item in inventory) {
            var data = inventory[item]
            searchBank.push(data.display_name)
        }
        setFuse(new Fuse(searchBank, {threshold: 0.4}))
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


    // useEffect(() => {
    //     console.log("sorting")
    //     const invClone = JSON.parse(JSON.stringify(inventory));
    //     var equipped = {}
        
    //     function checkLoadout(buddyUuid){
    //         Object.keys(loadout).forEach(key => {
    //             var weapon = loadout[key]
    //             if (weapon.buddy_uuid === buddyUuid) {
    //                 console.log("match")
    //                 return true;
    //             } else {
    //                 return false
    //             }
    //         })
    //     }

    //     Object.keys(inventory).forEach((key) => {
    //         console.log("e")
    //         var buddy = invClone[key]

    //         if (checkLoadout(buddy.uuid) === true) {
    //             //console.log(buddy)
    //             equipped[key] = buddy
    //             delete invClone[key]
    //         }
    //     })

    //     Object.keys(invClone).forEach((key) => {
    //         var buddy = invClone[key]
    //         //console.log(buddy)
    //         equipped[key] = buddy
    //     })

    //     setSortedInventory(equipped)
    //     console.log(equipped)
    // }, [loadout])


    return (
        <div className={classes.root}>

            <BuddyEditor/>

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
            </div>

            <div className={classes.gridContainer}>
                <Grid container spacing={3} className={classes.mainGrid} direction="row" justifyContent="flex-start" alignItems="flex-start">
                    {Object.keys(inventory).map((key) => {
                        var data = inventory[key]

                        return (
                            searchResults.includes(data.display_name) || searchResults.length === 0 ?  
                                <Grid item key={data.display_name} xl={3} lg={4} md={6} sm={12} xs={12}>
                                    <BuddyItem data={data} loadout={loadout}/>
                                </Grid>
                            : null
                        )
                    })}

                </Grid>
            </div>
        </div>
    )

}

export default Buddies;