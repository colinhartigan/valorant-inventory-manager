from ..entitlements.entitlement_manager import Entitlement_Manager
from .file_manager import File_Manager
from .skin_manager import Skin_Manager

from .. import shared

class Profile_Manager:

    @staticmethod 
    def fetch_profiles():
        return File_Manager.fetch_profiles()

    @staticmethod
    def generate_empty_profile():
        client = shared.client.client
        region = client.region
        puuid = client.puuid
        shard = client.shard

        inventory = Skin_Manager.fetch_inventory()["skins"]
        profiles = Profile_Manager.fetch_profiles()
        
        data = {
            "name": "New profile",
            "loadout": {},
            "skins": {
                weapon_uuid: {
                    skin_uuid: {
                        "favorite": False,
                        "levels": {
                            level_uuid: {
                                "favorite": False,
                            } for level_uuid, level_data in skin_data["levels"].items()
                        },
                        "chromas": {
                            chroma_uuid: {
                                "favorite": False,
                            } for chroma_uuid, chroma_data in skin_data["chromas"].items()
                        } 
                    } for skin_uuid, skin_data in weapon_data["skins"].items() if skin_data["unlocked"]
                } for weapon_uuid, weapon_data in inventory.items() 
            }
        }

        profiles[puuid][region][shard].append(data)

        File_Manager.update_file(profiles, 'profiles.json')