import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper, Typography, Box, CircularProgress } from '@material-ui/core'
import { Check } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({

    weaponPaper: {
        width: "100%",
        height: "75px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "0.1s ease-out !important",
        "&:hover": {
            border: `1px ${theme.palette.primary.main} solid`,
        },
    },

    container: {
        width: "93%",
        height: "90%",
        display: "flex",
    },



    favoriteButton: {
        alignSelf: "flex-end",
        right: "2px",
        height: "25px",
        objectPosition: "center center"
    }

}));

function Weapon(props) {
    const classes = useStyles();
    const theme = useTheme();

    const skinData = props.skinData;
    const weaponData = props.weaponData;
    const isMelee = weaponData.uuid === "2f59173c-4bed-b6c3-2191-dea9b58be9c7"
    const equipped = props.equipped;

    const isFavorite = props.skinData.favorite

    const [isSelected, setisSelected] = useState(skinData.uuid === props.selected.uuid);
    const [isHovered, setIsHovered] = useState(false);

    function select() {
        props.select(skinData.uuid);
    }

    useEffect(() => {
        if (props.selected.uuid === skinData.uuid) {
            setisSelected(true);
        } else {
            setisSelected(false);
        }
    }, [props.selected]);

    return (
        <Paper
            variant="outlined"
            className={classes.weaponPaper}
            onClick={select}
            style={{
                border: ((isFavorite && !isHovered && !isSelected) ? `1px ${theme.palette.warning.light} solid` : (isSelected ? `1px ${theme.palette.primary.light} solid` : null)),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={classes.container} style={{
                backgroundImage: `url(${skinData.display_icon})`,
                backgroundSize: !isMelee ? "contain" : "auto 87%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50% 50%",

                flexDirection: "row",
                justifyContent: null,
            }}>

                {/* <Box position="relative" display="inline-flex">
                    <CircularProgress variant="determinate" value={100} />
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                            props.value,
                        )}%`}</Typography>
                        <img component="div" src={skinData.content_tier.display_icon} alt="tier" style={{ height: "100%", objectFit: "contain", }} />
                    </Box>
                </Box> */}

                <div style={{width: "50%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
                    <img alt={skinData.content_tier.display_name} src={skinData.content_tier.display_icon} style={{ width: "auto", height: "25px", left: -6, position: "relative", bottom: "-2px", objectFit: "contain", alignSelf: "flex-end", margin: "3px", }} />
                </div>
                <div style={{width: "50%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
                    {equipped ? <Check style={{ width: "auto", height: "25px", right: -6, position: "relative", bottom: "-2px", objectFit: "contain", alignSelf: "flex-end", margin: "3px", color: "#66bb6a"}} /> : null}
                </div>

            </div>
        </Paper>
    )

}

export default Weapon;