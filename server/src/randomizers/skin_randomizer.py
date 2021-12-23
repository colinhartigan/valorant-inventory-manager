import random, asyncio

from ..inventory_management.file_manager import File_Manager
from .. import shared

class Skin_Randomizer:

    @staticmethod 
    async def randomize():
        valclient = shared.client.client
        loadout = valclient.fetch_player_loadout()
        equipped_skin_ids = [weapon["SkinID"] for weapon in loadout["Guns"]]

        inventory = File_Manager.fetch_individual_inventory(valclient)["skins"]

        randomizer_pool = {
            weapon: {
                skin: {
                    "weight": skin_data["weight"], 
                    "levels": {level: level_data for level,level_data in skin_data["levels"].items() if level_data["favorite"]}, 
                    "chromas": {chroma: chroma_data for chroma,chroma_data in skin_data["chromas"].items() if chroma_data["favorite"]}
                } for skin,skin_data in weapon_data["skins"].items() if skin_data["favorite"]
            } for weapon,weapon_data in inventory.items() if not weapon_data["locked"]
        }

        # unused for now
        randomizer_pool_no_repeats = {
            weapon: {
                skin: skin_data for skin,skin_data in weapon_data.items() if not skin in equipped_skin_ids
            } for weapon,weapon_data in randomizer_pool.items()
        }

        for weapon in loadout["Guns"]:
            if not inventory[weapon["ID"]]["locked"]:
                weapon_data = randomizer_pool[weapon["ID"]]

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
                    pass
            
        valclient.put_player_loadout(loadout=loadout)
        await shared.client.broadcast_loadout()
        print("done broadcasting")