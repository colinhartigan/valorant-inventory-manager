import { React, useEffect, useState } from 'react';

//utilities
import { makeStyles, useTheme } from '@material-ui/core/styles';

//components
import { Paper } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({

    weaponPaper: {
        width: "100%",
        height: "70px",
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

    tierImage: {
        height: "25px",
        alignSelf: "flex-end",
        margin: "3px 3px",
        position: "relative",
        bottom: "-3px",
        objectFit: "contain",
        objectPosition: "left center",
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

    const isFavorite = props.skinData.favorite

    const [isEquipped, setIsEquipped] = useState(skinData.uuid === props.equipped.uuid);

    function equip() {
        props.equip(skinData.uuid);
    }

    useEffect(() => {
        if (props.equipped.uuid === skinData.uuid) {
            setIsEquipped(true);
        } else {
            setIsEquipped(false);
        }
    }, [props.equipped]);

    return (
        <Paper 
            variant="outlined" 
            className={classes.weaponPaper} 
            onClick={equip} 
            style={{ 
                border: (isFavorite ? `1px ${theme.palette.warning.light} solid`: (isEquipped ? `1px ${theme.palette.primary.light} solid` : null)), 
            }}
        >
            <div className={classes.container} style={{
                backgroundImage: `url(${skinData.display_icon})`,
                backgroundSize: !isMelee ? "contain" : "auto 87%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "50% 50%",

                flexDirection: isMelee ? "column" : "row",
                justifyContent: isMelee ? "flex-end" : null,
            }}>

                <img alt={skinData.content_tier.display_name} src={skinData.content_tier.display_icon} className={classes.tierImage} style={{ left: !isMelee ? "-5px" : "5px" }} />
            </div>
        </Paper>
    )

} 

export default Weapon;