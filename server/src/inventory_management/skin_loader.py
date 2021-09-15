from ..file_management.filepath import Filepath

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
        pass 


    @staticmethod
    def generate_blank_skin_file():

        # notes:
        #   - need to include standard/default skins
        #   - all weapons should have at least one chroma/level
        #   - process all chromas/levels even if not entitled, just don't mark them as "unlocked"
        #   - will need to have a button to refresh the database for when people unlock a new skin, level, or chroma
        payload = {
            "puuid": {
                "region1": {
                    "weapon_uuid": {
                        "display_name": "asdf",
                        "weapon_type": "rifle",
                        "skins": {
                            "skin_uuid": {
                                "display_name": "asdf",
                                "favorite": False,
                                "weight": 1,
                                "content_tier": {
                                    "display_name": "exclusive",
                                    "index": 1,
                                    "image": "valorant-api image link"
                                },
                                "levels": {
                                    "level_uuid": {
                                        "display_name": "Level name",
                                        "index": 1,
                                        "level_type": "animation, vfx, finisher, etc",
                                        "image": "valorant-api image link",
                                        "unlocked": True,
                                        "favorite": False,
                                    }
                                },
                                "chromas": {
                                    "chroma_uuid": {
                                        "display_name": "asdf",
                                        "image": "valorant-api image link",
                                        "swatch_image": "valorant-api image link",
                                        "unlocked": True,
                                        "favorite": False,
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }