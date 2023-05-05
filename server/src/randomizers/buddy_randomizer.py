import random

from ..inventory_management.file_manager import File_Manager
from .. import shared

class Buddy_Randomizer:

    @staticmethod
    async def randomize():
        valclient = shared.client.client
        loadout = valclient.fetch_player_loadout()
        inventory = File_Manager.fetch_individual_inventory()["buddies"]

        # filter out locked buddies first
        locked_weapons = {}
        for buddy_uuid,buddy in inventory.items():
            for instance in buddy["instances"].values():
                if instance["locked"]:

                    locked_weapons[instance["locked_weapon_uuid"]] = {
                        "buddy_uuid": buddy_uuid,
                        "instance_uuid": instance["uuid"],
                        "level_uuid": buddy["level_uuid"],
                    }

        randomizer_pool = []
        for buddy_uuid,buddy in inventory.items():
            for instance in buddy["instances"].values():
                if instance["favorite"]:
                    randomizer_pool.append({
                        "buddy_uuid": buddy_uuid,
                        "level_uuid": buddy["level_uuid"],
                        "instance_uuid": instance["uuid"],
                    })

        for weapon in loadout["Guns"]:
            if weapon["ID"] != "2f59173c-4bed-b6c3-2191-dea9b58be9c7":
                if weapon["ID"] in locked_weapons.keys():
                    weapon["CharmID"] = locked_weapons[weapon["ID"]]["buddy_uuid"]
                    weapon["CharmLevelID"] = locked_weapons[weapon["ID"]]["level_uuid"]
                    weapon["CharmInstanceID"] = locked_weapons[weapon["ID"]]["instance_uuid"]

                else: 
                    try:
                        random_buddy_index = random.randrange(0,len(randomizer_pool))
                        random_buddy = randomizer_pool[random_buddy_index]
                        weapon["CharmID"] = random_buddy["buddy_uuid"]
                        weapon["CharmLevelID"] = random_buddy["level_uuid"]
                        weapon["CharmInstanceID"] = random_buddy["instance_uuid"]

                        randomizer_pool.pop(random_buddy_index)
                    except:
                        break
        
        shared.client.put_loadout(loadout)
        await shared.client.broadcast_loadout()