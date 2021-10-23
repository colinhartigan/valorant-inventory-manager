import requests, os, json
from valclient.client import Client as ValClient
from dotenv import load_dotenv

load_dotenv()

class Client:

    def __init__(self):

        self.client = ValClient(region="na",auth={"username": os.getenv("VALORANT_USERNAME"), "password": os.getenv("VALORANT_PASSWORD")})
        self.client.activate()

        self.all_weapon_data = requests.get("https://valorant-api.com/v1/weapons").json()["data"]
        self.all_buddy_data = requests.get("https://valorant-api.com/v1/buddies").json()["data"]
        self.content_tiers = requests.get("https://valorant-api.com/v1/contenttiers").json()["data"]

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
        return self.fetch_loadout()

    def fetch_loadout(self):
        loadout = self.client.fetch_player_loadout()

        payload = {}

        for weapon in loadout['Guns']:
            # skin stuff
            weapon_uuid = weapon['ID']
            weapon_data = next(item for item in self.all_weapon_data if item["uuid"] == weapon_uuid)
            skin_data = next(item for item in weapon_data["skins"] if item["uuid"] == weapon["SkinID"])
            level_data = next(item for item in skin_data["levels"] if item["uuid"] == weapon["SkinLevelID"])
            chroma_data = next(item for item in skin_data["chromas"] if item["uuid"] == weapon["ChromaID"])
            
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

            # buddy stuff
            if weapon.get("CharmID"):
                buddy_uuid = weapon['CharmID']
                buddy_data = next(item for item in self.all_buddy_data if item["uuid"] == buddy_uuid)
                pld["buddy_name"] = buddy_data.get("displayName")
                pld["buddy_image"] = buddy_data.get("displayIcon")
            else:
                pld["buddy_name"] = ""
                pld["buddy_image"] = ""

            pld["weapon_name"] = weapon_data["displayName"]
            pld["skin_name"] = skin_data["displayName"]
            pld["skin_uuid"] = skin_data["uuid"]
            pld["level_uuid"] = level_data["uuid"]
            pld["level_index"] = level_index + 1
            pld["chroma_uuid"] = chroma_data["uuid"]
            pld["skin_image"] = chroma_data["fullRender"]

            pld["skin_tier_image"] = tier_data["displayIcon"]
            pld["skin_tier_display_name"] = tier_data["devName"]

        return payload