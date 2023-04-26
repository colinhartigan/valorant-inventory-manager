import uuid, json, logging, traceback

from ..entitlements.entitlement_manager import Entitlement_Manager
from .file_manager import File_Manager
from .skin_manager import Skin_Manager

from .. import shared

logger_errors = logging.getLogger('VIM_errors')
logger = logging.getLogger('VIM_main')
logger_inv = logging.getLogger('VIM_profiles')

class Profile_Manager:
    SELECTED_PROFILE = None

    @staticmethod 
    def fetch_profiles():
        profiles = File_Manager.fetch_individual_profiles()
        if len(profiles) == 0:
            Profile_Manager.generate_empty_profile()
            return Profile_Manager.fetch_profiles()
        return profiles

    @staticmethod 
    def fetch_profile_metadata():
        profiles = Profile_Manager.fetch_profiles()
        payload = []
        for order, profile in enumerate(profiles):
            payload.append({
                "name": profile["name"],
                "order": order+1,
                "uuid": profile["uuid"],
            })
        print(payload)
        return payload

    @staticmethod 
    def update_profiles(**kwargs):
        new_metadata = kwargs.get("payload")
        profiles = Profile_Manager.fetch_profiles()
        new_profiles = [None for i in range(len(new_metadata))]
        for profile in profiles:
            for i, new_meta in enumerate(new_metadata):
                print(profile)
                if new_meta["uuid"] == profile["uuid"]:
                    new = profile
                    new["name"] = new_meta["name"]
                    new_profiles[i] = new
                    break
        File_Manager.update_individual_profiles(new_profiles)

    @staticmethod
    def generate_empty_profile():
        client = shared.client.client
        region = client.region
        puuid = client.puuid
        shard = client.shard

        inventory = Skin_Manager.fetch_inventory()["skins"]
        profiles = File_Manager.fetch_profiles()
        
        data = {
            "name": "New profile",
            "uuid": str(uuid.uuid4()),
            "loadout": shared.client.client.fetch_player_loadout(),
            "skins": {
                weapon_uuid: {
                    "total_weights": 1,
                    "locked": False,
                    "skins": {
                        skin_uuid: {
                            "favorite": False,
                            "weight": 1,
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
                    },
                } for weapon_uuid, weapon_data in inventory.items() 
            }
        }

        profiles[puuid][region][shard].append(data)

        File_Manager.update_file(profiles, 'profiles.json')

        return {
                "name": data["name"],
                "uuid": data["uuid"],
            }
    
    @staticmethod 
    def refresh_profiles():
        valclient = shared.client.client
        client = shared.client

        old_data = None

        try:
            old_data = File_Manager.fetch_profiles()[0]
        except KeyError:
            old_data = None
        except Exception as e:
            logger_errors.error(traceback.format_exc())
            logger.debug("making fresh profiles")
            Profile_Manager.generate_empty_profile()

        inventory = Skin_Manager.fetch_inventory()["skins"]

        # TODO: IMPLEMENT ME! SHOULD REFRESH ALL FIELDS, MAKE SURE ALL OWNED SKINS ARE ACCOUNTED FOR IN ALL PROFILES
        for weapon_uuid, weapon in inventory["skins"].items():
            existing_skin_data = None

            if old_data is not None:
                try:
                    existing_skin_data = old_data.get("skins").get(skin["uuid"])
                except:
                    pass

    @staticmethod
    def fetch_profile(**kwargs):
        profile_uuid = kwargs.get("profile_uuid")
        profiles = Profile_Manager.fetch_profiles()

        profile_uuids = [profile["uuid"] for profile in profiles]

        if profile_uuid == 0 or profile_uuid not in profile_uuids: 
            profile_uuid = profiles[0]["uuid"] # default to first profile

        client = shared.client.client
        region = client.region
        puuid = client.puuid
        shard = client.shard

        for profile in profiles:
            if profile["uuid"] == profile_uuid:
                return profile
            
    @staticmethod 
    async def apply_profile(**kwargs):
        profile_uuid = kwargs.get("profile_uuid")
        Profile_Manager.SELECTED_PROFILE = profile_uuid
        profile = Profile_Manager.fetch_profile(profile_uuid=profile_uuid)
        shared.client.put_loadout(profile["loadout"])
        await shared.client.broadcast_loadout()

    @staticmethod
    def update_profile_loadout(profile_uuid, loadout):
        profiles = Profile_Manager.fetch_profiles()
        for profile in profiles:
            if profile["uuid"] == profile_uuid:
                profile["loadout"] = loadout
                break
        File_Manager.update_individual_profiles(profiles)