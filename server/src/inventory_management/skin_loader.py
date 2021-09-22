from ..file_utilities.filepath import Filepath
from ..entitlements.entitlement_manager import Entitlement_Manager
from .file_manager import File_Manager

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
    def sanitize_level_type(type_string):
        new = "Base"
        if type_string is not None:
            new = type_string.replace("EEquippableSkinLevelItem::","")
        return new


    @staticmethod
    def fetch_content_tier(uuid):

        # define skin tier indices for sorting skins
        content_tiers = Skin_Loader.client.content_tiers

        tier_indices = {
            "Standard": 0,
            "Battlepass": 1,
            "Select": 2,
            "Deluxe": 3,
            "Premium": 4,
            "Exclusive": 5,
            "Ultra": 6,
        }

        if uuid not in ('standard', 'bp'):
            for tier in content_tiers:
                if tier["uuid"] == uuid:
                    return { 
                        "devName": tier_indices[tier["devName"]],
                        "index": tier_indices[tier["devName"]],
                        "displayIcon": tier["displayIcon"],
                    }
        elif uuid == "standard":
            return {
                "devName": "Standard",
                "displayIcon": "https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png", #PLACEHOLDER
                "index": tier_indices["Standard"]
            }
        elif uuid == "bp":
            return {
                "devName": "Battlepass",
                "displayIcon": "https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png", #PLACEHOLDER
                "index": tier_indices["Battlepass"]
            }

    @staticmethod 
    def update_skin_database():
        valclient = Skin_Loader.client.client
        client = Skin_Loader.client

        try:
            File_Manager.fetch_skin_inventory()
        except:
            print("making fresh skin database")
            Skin_Loader.generate_blank_skin_database()

        skin_level_entitlements = Entitlement_Manager.fetch_entitlements(valclient,"skin_level")["Entitlements"]
        skin_level_entitlements = [item["ItemID"] for item in skin_level_entitlements]

        chroma_level_entitlements = Entitlement_Manager.fetch_entitlements(valclient,"skin_chroma")["Entitlements"]
        chroma_level_entitlements = [item["ItemID"] for item in chroma_level_entitlements]

        inventory = {}

        # iterate through each skin
        for weapon in client.all_weapon_data:
            for skin in weapon["skins"]:
                skin_owned = False
                skin_is_standard = False
                levels = [level["uuid"] for level in skin["levels"]]

                # check if the currnet iterated skin is owned
                if "Standard" in skin["displayName"] or skin["displayName"] == "Melee": #thanks rito for inconsistent naming schemes
                    skin_owned = True
                    if skin["displayName"] == "Melee":
                        skin["displayName"] = "Standard Melee"
                    skin_is_standard = True
                if not skin_owned:
                    for level in levels:
                        if level in skin_level_entitlements:
                            skin_owned = True
                            break

                if skin_owned:
                    # skin is owned, generate data for it
                    skin_payload = {}
                    
                    skin_payload["display_name"] = skin["displayName"]
                    skin_payload["uuid"] = skin["uuid"]
                    skin_payload["favorite"] = False # NOTE; WILL NEED TO IMPLEMENT CHECKING IF EXISTING SKIN DATA ALREADY EXISTS
                    skin_payload["weight"] = 1


                    tier = ""
                    if skin["contentTierUuid"] is not None:
                        tier = skin["contentTierUuid"]
                    elif skin_is_standard:
                        tier = "standard"
                    else:
                        tier = "bp"
                    skin_payload["content_tier"] = Skin_Loader.fetch_content_tier(tier)


                    # generate level data
                    skin_payload["levels"] = {}
                    for index, level in enumerate(skin["levels"]):
                        skin_payload["levels"][level["uuid"]] = {}
                        level_payload = skin_payload["levels"][level["uuid"]]

                        level_payload["uuid"] = level["uuid"]

                        level_payload["display_name"] = level["displayName"]
                        if level["displayName"] is None:
                            level_payload["displayName"] = f"{skin['displayName']} Level {index + 1}"
                        
                        level_payload["index"] = index + 1
                        level_payload["level_type"] = Skin_Loader.sanitize_level_type(level["levelItem"])
                        level_payload["display_icon"] = level["displayIcon"]
                        level_payload["video_preview"] = level["streamedVideo"]

                        level_payload["unlocked"] = level["uuid"] in skin_level_entitlements
                        if skin_is_standard:
                            level_payload["unlocked"] = True

                        level_payload["favorite"] = False

                    # generate chroma data
                    skin_payload["chromas"] = {}
                    for index, chroma in enumerate(skin["chromas"]):
                        skin_payload["chromas"][chroma["uuid"]] = {}
                        chroma_payload = skin_payload["chromas"][chroma["uuid"]]

                        chroma_payload["uuid"] = chroma["uuid"]
                        chroma_payload["display_name"] = chroma["displayName"]
                        chroma_payload["display_icon"] = chroma["fullRender"]
                        chroma_payload["swatch_icon"] = chroma["swatch"] 
                        chroma_payload["video_preview"] = chroma["streamedVideo"]        

                        chroma_payload["unlocked"] = level["uuid"] in skin_level_entitlements
                        if skin_is_standard:
                            chroma_payload["unlocked"] = True

                        level_payload["favorite"] = False

                    print(skin_payload)
                    # just need to save it to file with current uuid/region

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
            #print(payload)


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