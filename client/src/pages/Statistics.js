import { React, useEffect, useState } from 'react';

//utilities
import { useTheme } from '@mui/material/styles';
import { Divider } from '@mui/material'

import { Grid, Container, Typography, Paper } from '@mui/material'

function Statistics(props) {

    const theme = useTheme();

    const md = `[![Discord](https://img.shields.io/badge/discord-join-7389D8?style=flat&logo=discord)](https://discord.gg/uGuswsZwAT) ### [installation guide](https://github.com/colinhartigan/valorant-inventory-manager#installationusage) >### ❗VIM is not a "skin hack" and you will not get any free skins from using it ## Changelog - fixed white screen bug/freeze during onboarding - fixed compatibility bug with old buddy data structure - updated randomizer behavior - if only one skin is eligible for randomization and it has multiple chromas favorited, a chroma won't be repeated ___ if you encounter any bugs, create an [issue](https://github.com/colinhartigan/valorant-inventory-manager/issues) if you have suggestions or want to contribute, open a [pull request](https://github.com/colinhartigan/valorant-inventory-manager/pulls) https://github.com/colinhartigan/valorant-inventory-manager/compare/v1.0.1...v1.0.0`

    return (
        <>
            <div style={{ height: "100%", width: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "auto", flexGrow: 1 }}>
                <Container maxWidth={"xl"} style={{ width: "100%", height: "100%", display: "flex", flexGrow: 1, flexDirection: "column", }}>

                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignContent: "center", width: "100%", height: "75px", }}>
                        <Typography variant="h4" style={{ color: theme.palette.primary.light, fontSize: "2.2rem", flexGrow: 1, margin: "auto" }}>Statistics</Typography>
                    </div>

                    <Grid container spacing={2} sx={{width: "100%", height: "auto"}}>
                        <Grid item>
                            <Paper variant="outlined" sx={{width: "auto", height: "auto", padding: "30px"}}>
                                <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                    <Typography variant="h2">
                                        120
                                    </Typography>
                                    <Typography variant="h6">
                                        skins owned
                                    </Typography>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>


                </Container>
            </div>
        </>
    )
}


export default Statistics