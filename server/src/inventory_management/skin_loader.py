from ..file_utilities.filepath import Filepath
from ..entitlements.entitlement_manager import Entitlement_Manager

class Skin_Loader:

    client = None


    @staticmethod
    def sanitize_chroma_name(skin, chroma, weapon_name):
        try:
            new = chroma
            new = new.rstrip("\\r\\n")
            new = new.strip(weapon_name)
            new = new[new.find("(") + 1:new.find(")")]
            if new in skin['displayName']:
                new = "Base"
            return new
        except:
            return "Base"

    @staticmethod
    def sanitize_level_name(index, level, skin_name):
        try:
            if not "Standard" in skin_name:
                new = level 
                new = level.replace(skin_name,"").strip()
                if new == "":
                    return "Level 1"
                return new 
            else:
                return f"Level {index+1}"
        except:
            return f"Level {index+1}"

    @staticmethod
    def fetch_content_tier(tiers, uuid):

        # define skin tier indices for sorting skins

        tier_indices = {
            "Standard": 0,
            "Battlepass": 1,
            "Select": 2,
            "Deluxe": 3,
            "Premium": 4,
            "Exclusive": 5,
            "Ultra": 6,
        }

        tier_colors = {
            "Standard": "Grey",
            "Battlepass": "White",
            "Select": "Blue",
            "Deluxe": "Lime",
            "Premium": "Purple",
            "Ultra": "Yellow",
            "Exclusive": "DarkGoldenRod"
        }

        if uuid not in ('standard', 'bp'):
            for tier in tiers:
                if tier["uuid"] == uuid:
                    tier["index"] = tier_indices[tier["devName"]]
                    tier["highlightColor"] = tier_colors[tier["devName"]]
                    return tier
        elif uuid == "standard":
            return {
                "devName": "Standard",
                "highlightColor": tier_colors["Standard"],
                "index": tier_indices["Standard"]
            }
        elif uuid == "bp":
            return {
                "devName": "Battlepass",
                "highlightColor": tier_colors["Battlepass"],
                "index": tier_indices["Battlepass"]
            }

    @staticmethod 
    def update_skin_database():
        valclient = Skin_Loader.client.client
        client = Skin_Loader.client

        try:
            pass
            #File_Manager.fetch_skin_inventory()
        except:
            print("making fresh skin database")
            Skin_Loader.generate_blank_skin_database()

        skin_level_entitlements = Entitlement_Manager.fetch_entitlements(valclient,"skin_level")["Entitlements"]
        skin_level_entitlements = [item["ItemID"] for item in skin_level_entitlements]

        chroma_level_entitlements = Entitlement_Manager.fetch_entitlements(valclient,"skin_chroma")["Entitlements"]
        chroma_level_entitlements = [item["ItemID"] for item in chroma_level_entitlements]

        # use skin level entitlements to determine which skins are owned (create a list of uuids)
        # then iterate through each skin uuid and add all levels/chromas then enable the ones that are unlocked and stuff



    @staticmethod
    def generate_blank_skin_database():
        if Skin_Loader.client is not None:
            valclient = Skin_Loader.client.client
            client = Skin_Loader.client
            puuid = valclient.puuid
            region = valclient.region
            weapon_data = client.all_weapon_data


            payload = {
                puuid: {
                    region: {
                        weapon["uuid"]: {} for weapon in weapon_data
                    }
                }
            }
            print(payload)


        # notes:
        #   - need to include standard/default skins
        #   - all weapons should have at least one chroma/level
        #   - process all chromas/levels even if not entitled, just don't mark them as "unlocked"
        #   - will need to have a button to refresh the database for when people unlock a new skin, level, or chroma
        #   - maybe compress this (according to krish)

        # payload = {
        #     "puuid": {
        #         "region1": {
        #             "weapon_uuid": {
        #                 "display_name": "asdf",
        #                 "weapon_type": "rifle",
        #                 "skins": {
        #                     "skin_uuid": {
        #                         "display_name": "asdf",
        #                         "favorite": False,
        #                         "weight": 1,
        #                         "content_tier": {
        #                             "display_name": "exclusive",
        #                             "index": 1,
        #                             "image": "valorant-api image link"
        #                         },
        #                         "levels": {
        #                             "level_uuid": {
        #                                 "display_name": "Level name",
        #                                 "index": 1,
        #                                 "level_type": "animation, vfx, finisher, etc",
        #                                 "image": "valorant-api image link",
        #                                 "unlocked": True,
        #                                 "favorite": False,
        #                             }
        #                         },
        #                         "chromas": {
        #                             "chroma_uuid": {
        #                                 "display_name": "asdf",
        #                                 "image": "valorant-api image link",
        #                                 "swatch_image": "valorant-api image link",
        #                                 "unlocked": True,
        #                                 "favorite": False,
        #                             }
        #                         }
        #                     },
        #                 }
        #             }
        #         }
        #     }
        # }