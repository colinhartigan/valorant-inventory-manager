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
        '''
        fetch all profiles for the current user
        '''
        profiles = File_Manager.fetch_individual_profiles()
        if len(profiles) == 0:
            Profile_Manager.generate_empty_profile()
            return Profile_Manager.fetch_profiles()
        return profiles

    @staticmethod 
    def fetch_profile_metadata():
        '''
        fetch profile metadata (name, uuid, sorted order)
        '''
        profiles = Profile_Manager.fetch_profiles()
        payload = []
        for order, profile in enumerate(profiles):
            payload.append({
                "name": profile["name"],
                "order": order+1,
                "uuid": profile["uuid"],
            })
        return payload

    @staticmethod 
    def update_profiles(**kwargs):
        '''
        update profile metadata for all profiles with order
        '''
        new_metadata = kwargs.get("payload")
        profiles = Profile_Manager.fetch_profiles()
        new_profiles = [None for i in range(len(new_metadata))]
        for profile in profiles:
            for i, new_meta in enumerate(new_metadata):
                if new_meta["uuid"] == profile["uuid"]:
                    new = profile
                    new["name"] = new_meta["name"]
                    new_profiles[i] = new
                    break
        File_Manager.update_individual_profiles(new_profiles)

    @staticmethod
    async def update_profile(**kwargs):
        payload = json.loads(kwargs.get("payload"))
        profile_data = payload.get("profileData")["skins"]
        profile_uuid = payload.get("profileUuid")
        weapon_uuid = payload.get("weaponUuid")

        profiles = Profile_Manager.fetch_profiles()
        # find profile with matching profile uuid
        profile = {}
        for p in profiles:
            if p["uuid"] == profile_uuid:
                profile = p
        weapon_data = profile["skins"][weapon_uuid]

        inventory_data = Skin_Manager.fetch_inventory()["skins"][weapon_uuid]

        weapon_data["locked"] = payload.get("profileData")["locked"]
        weapon_data["total_weights"] = payload.get("profileData")["total_weights"]

        for skin_uuid, skin_data in weapon_data["skins"].items():
            skin_data["weight"] = profile_data[skin_uuid]["weight"]
            skin_data["favorite"] = profile_data[skin_uuid]["favorite"]
            inventory_skin_data = inventory_data["skins"][skin_uuid]

            def find_top_unlocked(key):
                for index in range(len(inventory_skin_data[key])-1,-1,-1):
                    data = inventory_skin_data[key][list(inventory_skin_data[key].keys())[index]]
                    if data["unlocked"]:
                        return skin_data[key][list(inventory_skin_data[key].keys())[index]]
                    
            def find_bottom_unlocked(key):
                for index in range(len(inventory_skin_data[key])):
                    data = inventory_skin_data[key][list(inventory_skin_data[key].keys())[index]]
                    if data["unlocked"]:
                        return skin_data[key][list(inventory_skin_data[key].keys())[index]]

            # update favorites
            for level_uuid, level_data in skin_data["levels"].items():
                level_data["favorite"] = profile_data[skin_uuid]["levels"][level_uuid]["favorite"]
            for chroma_uuid, chroma_data in skin_data["chromas"].items():
                chroma_data["favorite"] = profile_data[skin_uuid]["chromas"][chroma_uuid]["favorite"]

            if skin_data["favorite"]:
                # make sure theres at least one enabled level/chroma if the skin is favorited
                level_count = len(skin_data["levels"].keys())
                chroma_count = len(skin_data["chromas"].keys())

                favorited_levels = [uuid for uuid, level in skin_data["levels"].items() if level["favorite"]]
                favorited_chromas = [uuid for uuid, chroma in skin_data["chromas"].items() if chroma["favorite"]]

                # if a lower level is favorited, make sure the lowest chroma is also favorited
                for level_uuid in favorited_levels:
                    level_data = skin_data["levels"][level_uuid]
                    level_inv_data = inventory_skin_data["levels"][level_uuid]
                    if level_inv_data["index"] != level_count:
                        chroma_uuid = next(uuid for uuid, chroma in skin_data["chromas"].items() if chroma["base"])
                        if not chroma_uuid in favorited_chromas:
                            skin_data["chromas"][chroma_uuid]["favorite"] = True
                            favorited_chromas.append(chroma_uuid)
                        

                # if a high level chroma is favorited and max level is not, favorite the max level
                for chroma_uuid in favorited_chromas:
                    chroma_inv_data = inventory_skin_data["chromas"][chroma_uuid]
                    if chroma_inv_data["index"] != 1:
                        level = find_top_unlocked("levels")
                        level["favorite"] = True
                        favorited_levels.append(level)

                if len(favorited_levels) == 0:
                    find_top_unlocked("levels")["favorite"] = True

                if len(favorited_chromas) == 0:
                    find_bottom_unlocked("chromas")["favorite"] = True
        
        File_Manager.update_individual_profiles(profiles)
        await shared.client.broadcast_loadout()
        return profile


    @staticmethod
    def generate_empty_profile():
        '''
        generate a new profile
        '''
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
                                    "base": False,
                                } for level_uuid, level_data in skin_data["levels"].items()
                            },
                            "chromas": {
                                chroma_uuid: {
                                    "favorite": False,
                                    "base": False,
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
        '''
        refresh all profiles (make sure all own skins are accounted for)
        '''
        valclient = shared.client.client
        client = shared.client

        old_data = None

        try:
            old_data = Profile_Manager.fetch_profiles()[0]
        except KeyError:
            old_data = None
        except Exception as e:
            logger_errors.error(traceback.format_exc())
            logger.debug("making fresh profiles")
            Profile_Manager.generate_empty_profile()

        inventory = Skin_Manager.fetch_inventory()

        profiles = []

        for index, profile in enumerate(Profile_Manager.fetch_profiles()):
            
            for weapon_uuid, weapon in inventory["skins"].items():
                weapon_payload = {}
                old_weapon_data = None

                if old_data is not None:
                    try:
                        old_weapon_data = profile["skins"][weapon["uuid"]]
                    except:
                        pass

                weapon_payload["total_weights"] = 0
                weapon_payload["locked"] = old_weapon_data["locked"] if old_weapon_data is not None else False
                weapon_payload["skins"] = {}

                for skin_uuid, skin in weapon["skins"].items():
                    if skin["unlocked"]: 

                        existing_skin_data = None

                        if old_weapon_data is not None:
                            try:
                                existing_skin_data = old_weapon_data.get("skins").get(skin["uuid"])
                            except:
                                pass
                                
                        skin_payload = {}

                        skin_payload["favorite"] = existing_skin_data["favorite"] if existing_skin_data is not None else False
                        skin_payload["weight"] = existing_skin_data["weight"] if existing_skin_data is not None else 1
                        weapon_payload["total_weights"] += skin_payload["weight"] if skin_payload["favorite"] else 0

                        skin_payload["levels"] = {}
                        for level_uuid, level in skin["levels"].items():
                            skin_payload["levels"][level["uuid"]] = {}
                            level_payload = skin_payload["levels"][level["uuid"]]

                            level_payload["favorite"] = existing_skin_data["levels"][level["uuid"]]["favorite"] if existing_skin_data is not None else False
                            level_payload["base"] = level["index"] == 1

                        skin_payload["chromas"] = {}
                        for chroma_uuid, chroma in skin["chromas"].items():
                            skin_payload["chromas"][chroma["uuid"]] = {}
                            chroma_payload = skin_payload["chromas"][chroma["uuid"]]

                            chroma_payload["favorite"] = existing_skin_data["chromas"][chroma["uuid"]]["favorite"] if existing_skin_data is not None else False
                            chroma_payload["base"] = chroma["index"] == 1

                        weapon_payload["skins"][skin_uuid] = skin_payload

                profile["skins"][weapon_uuid] = weapon_payload
            
            profiles.append(profile)

        File_Manager.update_individual_profiles(profiles)


    @staticmethod
    def fetch_profile(**kwargs):
        profile_uuid = Profile_Manager.SELECTED_PROFILE
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
        #shared.client.put_loadout(profile["loadout"])
        await shared.client.broadcast_loadout()
        return profile

    @staticmethod
    def update_profile_loadout(profile_uuid, loadout):
        profiles = Profile_Manager.fetch_profiles()
        for profile in profiles:
            if profile["uuid"] == profile_uuid:
                profile["loadout"] = loadout
                break
        File_Manager.update_individual_profiles(profiles)