import random

from ..inventory_management.file_manager import File_Manager
from ..inventory_management.profile_manager import Profile_Manager
from .. import shared

class Skin_Randomizer:

    @staticmethod 
    async def randomize():
        valclient = shared.client.client
        loadout = valclient.fetch_player_loadout()
        equipped_skin_ids = [weapon["SkinID"] for weapon in loadout["Guns"]]
        equipped_chroma_ids = [weapon["ChromaID"] for weapon in loadout["Guns"]]

        inventory = Profile_Manager.fetch_profile()["skins"]

        randomizer_pool = {
            weapon: {
                skin: {
                    "weight": skin_data["weight"], 
                    "levels": {level: level_data for level,level_data in skin_data["levels"].items() if level_data["favorite"]}, 
                    "chromas": {chroma: chroma_data for chroma,chroma_data in skin_data["chromas"].items() if chroma_data["favorite"]}
                } for skin,skin_data in weapon_data["skins"].items() if skin_data["favorite"]
            } for weapon,weapon_data in inventory.items() if not weapon_data["locked"]
        }

        randomizer_pool_no_repeats = {}

        for weapon_uuid,weapon in randomizer_pool.items():
            randomizer_pool_no_repeats[weapon_uuid] = {}
            for skin_uuid,skin in weapon.items():
                if len(weapon.values()) > 2:
                    
                    if skin_uuid not in equipped_skin_ids:
                        if weapon_uuid == "ec845bf4-4f79-ddda-a3da-0db3774b2794":
                            pass
                            #print(skin_uuid in equipped_skin_ids)
                        randomizer_pool_no_repeats[weapon_uuid][skin_uuid] = skin
                else:
                    new_chromas = {}
                    #remove duplicate chroma
                    for chroma_uuid,chroma in skin["chromas"].items():
                        if not chroma_uuid in equipped_chroma_ids and len(skin["chromas"]) > 1:
                            new_chromas[chroma_uuid] = chroma 
                        elif len(skin["chromas"]) == 1:
                            new_chromas[chroma_uuid] = chroma
                    skin["chromas"] = new_chromas
                    randomizer_pool_no_repeats[weapon_uuid][skin_uuid] = skin
            if weapon_uuid == "ec845bf4-4f79-ddda-a3da-0db3774b2794":
                pass
                #print("")

        for weapon in loadout["Guns"]:
            if not inventory[weapon["ID"]]["locked"]:
                #print(f"{len(randomizer_pool_no_repeats[weapon['ID']].values())}\n")
                weapon_data = {}

                if (shared.config["skin_randomizer"]["settings"]["prevent_randomizer_repeats"]["value"] == True and len(randomizer_pool_no_repeats[weapon['ID']].values()) >= 1):
                    #print(weapon["ID"])
                    weapon_data = randomizer_pool_no_repeats[weapon["ID"]]  
                else:
                    weapon_data = randomizer_pool[weapon["ID"]]

                #if weapon["ID"] == "2f59173c-4bed-b6c3-2191-dea9b58be9c7":
                    #print(f"{weapon_data}\n")

                # if data is blank just leave skin as is
                if weapon_data != {}:
                    weights = (weapon_data[skin]["weight"] for skin in weapon_data)
                    
                    skin_uuid = random.choices(list(weapon_data.keys()), weights=weights)[0]
                    skin = weapon_data[skin_uuid]

                    max_level = len(skin["levels"])
                    level_index = max_level - 1 # use max level by default unless min chroma level is selected

                    chroma_index = random.randrange(0,len(skin["chromas"])) if len(skin["chromas"]) > 0 else 0

                    if chroma_index == 0:
                        level_index = random.randrange(0,len(skin["levels"]))

                    weapon["SkinID"] = skin_uuid
                    weapon["SkinLevelID"] = list(skin["levels"].keys())[level_index]
                    weapon["ChromaID"] = list(skin["chromas"].keys())[chroma_index]
                else:
                    #print(weapon["ID"])
                    pass
        
        shared.client.put_loadout(loadout)
        await shared.client.broadcast_loadout()