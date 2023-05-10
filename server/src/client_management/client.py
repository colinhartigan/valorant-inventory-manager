import traceback
import requests, os, json, asyncio, logging
from valclient.client import Client as ValClient
from dotenv import load_dotenv

from ..inventory_management.file_manager import File_Manager
from ..inventory_management.profile_manager import Profile_Manager
from ..sys_utilities.system import System
from ..broadcast import broadcast

from ..client_config import COLLECTIONS_WITH_BAD_LEVEL_IMAGES, AUTH_MODE
from .. import shared

load_dotenv()
logger_errors = logging.getLogger('VIM_errors')
logger = logging.getLogger('VIM_main')

class Client:

    def __init__(self):

        self.client = None 
        self.ready = False

        self.all_weapon_data = requests.get("https://valorant-api.com/v1/weapons").json()["data"]
        self.all_buddy_data = requests.get("https://valorant-api.com/v1/buddies").json()["data"]
        self.content_tiers = requests.get("https://valorant-api.com/v1/contenttiers").json()["data"]

    def connect(self,force_local=False):
        if self.ready == False:
            try:
                if AUTH_MODE == "credentials":
                    self.client = ValClient(region=os.getenv("REGION"),auth={"username": os.getenv("VALORANT_USERNAME"), "password": os.getenv("VALORANT_PASSWORD")})
                elif AUTH_MODE == "local" or force_local: 
                    region = self.autodetect_region()
                    if region is not None:
                        self.client = ValClient(region=region)
                    else:
                        self.ready = False 
                
                if self.client is not None:
                    try:
                        self.client.activate()
                        self.ready = True
                        logger.debug("successfully initialized client")
                    except Exception as e:
                        self.ready = False 
                        self.client = None
                        logger_errors.error(traceback.format_exc())
                else:
                    logger.debug("client is not ready")
                    self.ready = False 

            except:
                logger_errors.error(traceback.format_exc())
                self.ready = False
                logger_errors.debug("cant activate client, game not running")

    async def check_connection(self):
        if not System.are_processes_running():
            self.ready = False 
            self.client = None
            payload = {
                "event": "game_not_running",
                "data": {}
            }
            await broadcast(payload)
            return False
        else:
            if not self.ready:
                self.connect()
                payload = {
                    "event": "client_connected",
                    "data": True
                }
                await broadcast(payload)
                return True

    def autodetect_account(self):
        try:
            self.connect(force_local=True)
            payload = {
                "game_name": self.client.player_name, 
                "game_tag": self.client.player_tag,
                "region": self.client.region.upper(),
                "shard": self.client.shard.upper(),
                "puuid": self.client.puuid,
            }
            return payload
        except:
            logger_errors.error(traceback.format_exc())
            raise Exception

    def autodetect_region(self):
        client = ValClient(region="na")
        try:
            client.activate()
        except:
            return None
        sessions = client.riotclient_session_fetch_sessions()
        for _,session in sessions.items():
            if session["productId"] == "valorant":
                launch_args = session["launchConfiguration"]["arguments"]
                for arg in launch_args:
                    if "-ares-deployment" in arg:
                        region = arg.replace("-ares-deployment=","")
                        return region

    def put_weapon(self,**kwargs):
        payload = json.loads(kwargs.get("payload"))
        weapon_uuid = payload["weaponUuid"]
        skin_uuid = payload["skinUuid"]
        level_uuid = payload["levelUuid"]
        chroma_uuid = payload["chromaUuid"]

        loadout = self.client.fetch_player_loadout()
        for weapon in loadout["Guns"]:
            if weapon["ID"] == weapon_uuid:
                weapon["SkinID"] = skin_uuid 
                weapon["SkinLevelID"] = level_uuid
                weapon["ChromaID"] = chroma_uuid 

        self.client.put_player_loadout(loadout)
        Profile_Manager.update_profile_loadout(Profile_Manager.SELECTED_PROFILE, self.client.fetch_player_loadout())
        return self.fetch_loadout()

    def put_loadout(self, new_loadout):
        self.client.put_player_loadout(new_loadout)
        Profile_Manager.update_profile_loadout(Profile_Manager.SELECTED_PROFILE, self.client.fetch_player_loadout())
        return self.fetch_loadout()

    def put_buddies(self, **kwargs):
        new_loadout = json.loads(kwargs.get("payload"))
        loadout = self.client.fetch_player_loadout()
        for weapon in loadout["Guns"]:
            weapon_uuid = weapon["ID"]
            if weapon_uuid != "2f59173c-4bed-b6c3-2191-dea9b58be9c7":
                if new_loadout[weapon_uuid]["buddy_uuid"] != "":
                    weapon["CharmID"] = new_loadout[weapon_uuid]["buddy_uuid"]
                    weapon["CharmInstanceID"] = new_loadout[weapon_uuid]["buddy_instance_uuid"]
                    weapon["CharmLevelID"] = new_loadout[weapon_uuid]["buddy_level_uuid"]
                else:
                    weapon["CharmID"] = None
                    weapon["CharmInstanceID"] = None
                    weapon["CharmLevelID"] = None
        
        self.client.put_player_loadout(loadout)
        Profile_Manager.update_profile_loadout(Profile_Manager.SELECTED_PROFILE, self.client.fetch_player_loadout())
        return self.fetch_loadout()


    def fetch_loadout(self):
        loadout = self.client.fetch_player_loadout()
        inventory = File_Manager.fetch_individual_inventory()["skins"]
        profile = Profile_Manager.fetch_profile()["skins"]

        payload = {}

        for weapon in loadout['Guns']:
            # skin stuff
            weapon_uuid = weapon['ID']
            weapon_data = next(item for item in self.all_weapon_data if item["uuid"] == weapon_uuid)
            skin_data = next(item for item in weapon_data["skins"] if item["uuid"] == weapon["SkinID"])
            level_data = next(item for item in skin_data["levels"] if item["uuid"] == weapon["SkinLevelID"])
            chroma_data = next(item for item in skin_data["chromas"] if item["uuid"] == weapon["ChromaID"])

            inventory_data = inventory[weapon_uuid]
            profile_data = profile[weapon_uuid]

            payload[weapon_uuid] = {}
            pld = payload[weapon_uuid]

            try:
                tier_data = next(tier for tier in self.content_tiers if tier["uuid"] == skin_data["contentTierUuid"])
            except:
                tier_data = {
                    "devName": "Battlepass",
                    "displayIcon": "https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png",
                }

            level_index = 0
            for level,data in enumerate(skin_data["levels"]):
                if data["uuid"] == weapon["SkinLevelID"]:
                    level_index = level
                    break

            chroma_index = 0
            for chroma,data in enumerate(skin_data["chromas"]):
                if data["uuid"] == weapon["ChromaID"]:
                    chroma_index = chroma
                    break

            # if a skin has bad images
            if chroma_index == 0 and level_data["displayIcon"] != None:
                if skin_data["themeUuid"] in COLLECTIONS_WITH_BAD_LEVEL_IMAGES or "Standard" in skin_data["displayName"]:
                    pld["skin_image"] = skin_data["chromas"][0]["fullRender"]
                else:
                    pld["skin_image"] = level_data["displayIcon"]
            else:
                pld["skin_image"] = chroma_data["fullRender"]

            # buddy stuff
            if weapon.get("CharmID"):
                buddy_uuid = weapon['CharmID']
                buddy_data = next(item for item in self.all_buddy_data if item["uuid"] == buddy_uuid)
                pld["buddy_name"] = buddy_data.get("displayName")
                pld["buddy_image"] = buddy_data.get("displayIcon")
                pld["buddy_uuid"] = buddy_data.get("uuid")
                pld["buddy_instance_uuid"] = weapon.get("CharmInstanceID")
                pld["buddy_level_uuid"] = weapon.get("CharmLevelID")
            else:
                pld["buddy_name"] = ""
                pld["buddy_image"] = ""
                pld["buddy_uuid"] = ""
                pld["buddy_instance_uuid"] = ""
                pld["buddy_level_uuid"] = ""

            pld["weapon_killstream_icon"] = weapon_data["killStreamIcon"]
            pld["weapon_name"] = weapon_data["displayName"]
            pld["weapon_uuid"] = weapon_data["uuid"]
            pld["skin_name"] = skin_data["displayName"]
            pld["skin_uuid"] = skin_data["uuid"]
            pld["level_uuid"] = level_data["uuid"]
            pld["level_video"] = level_data["streamedVideo"]
            pld["level_index"] = level_index + 1
            pld["chroma_uuid"] = chroma_data["uuid"]
            pld["chroma_video"] = chroma_data["streamedVideo"]

            pld["skin_tier_image"] = tier_data["displayIcon"]
            pld["skin_tier_display_name"] = tier_data["devName"]

            if profile_data["skins"].get(skin_data["uuid"]):
                # some users don't unequip a skin after refunding it, so it's not seen in the inventory and crashes the app
                pld["favorite"] = profile_data["skins"][skin_data["uuid"]]["favorite"]
                pld["locked"] = profile_data["locked"]
                pld["bugged"] = False
            else:
                pld["favorite"] = False 
                pld["locked"] = False
                pld["bugged"] = True
            

        return {"loadout": payload}

    async def broadcast_loadout(self):
        loadout = self.fetch_loadout()
        payload = {
            "event": "loadout_updated",
            "data": loadout
        }
        await broadcast(payload)