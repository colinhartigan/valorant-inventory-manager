import requests, os
from valclient.client import Client as ValClient
from dotenv import load_dotenv

load_dotenv()

class Client:

    def __init__(self):
        self.client = ValClient()
        try:
            self.client.activate()
        except:
            self.client = ValClient(auth={"username": os.getenv("VALORANT_USERNAME"), "password": os.getenv("VALORANT_PASSWORD")})
            self.client.activate()

        self.all_weapon_data = requests.get("https://valorant-api.com/v1/weapons").json()["data"]

    def fetch_loadout(self):
        loadout = self.client.fetch_player_loadout()

        payload = {}

        for weapon in loadout['Guns']:
            weapon_uuid = weapon['ID']
            weapon_data = next(item for item in self.all_weapon_data if item["uuid"] == weapon_uuid)
            skin_data = next(item for item in weapon_data["skins"] if item["uuid"] == weapon["SkinID"])
            level_data = next(item for item in skin_data["levels"] if item["uuid"] == weapon["SkinLevelID"])
            chroma_data = next(item for item in skin_data["chromas"] if item["uuid"] == weapon["ChromaID"])

            payload[weapon_uuid] = {}
            pld = payload[weapon_uuid]
            pld["weapon_name"] = weapon_data["displayName"]
            pld["skin_name"] = skin_data["displayName"]
            pld["skin_uuid"] = skin_data["uuid"]
            pld["level_uuid"] = level_data["uuid"]
            pld["chroma_uuid"] = chroma_data["uuid"]
            pld["image"] = f"https://media.valorant-api.com/weaponskinchromas/{chroma_data['uuid']}/fullrender.png"

        #print(payload)
        return payload