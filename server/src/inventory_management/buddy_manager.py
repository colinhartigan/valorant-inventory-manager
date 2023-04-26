import traceback, re, json, logging

from ..file_utilities.filepath import Filepath
from ..entitlements.entitlement_manager import Entitlement_Manager
from .file_manager import File_Manager
from ..client_config import COLLECTIONS_WITH_BAD_LEVEL_IMAGES, UNLOCK_ALL_BUDDIES

from .. import shared

logger_errors = logging.getLogger('VIM_errors')
logger = logging.getLogger('VIM_main')
logger_inv = logging.getLogger('VIM_inventory')

class Buddy_Manager:

    @staticmethod
    def generate_blank_buddy_database():
        if shared is not None:
            client = shared.client
            weapon_data = client.all_weapon_data

            payload = {}
            File_Manager.update_individual_inventory(payload, "buddies")

    @staticmethod
    async def update_inventory(**kwargs):
        payload = json.loads(kwargs.get("payload"))
        buddy_uuid = payload["buddyUuid"]
        new_data = payload["newData"]

        inventory = File_Manager.fetch_individual_inventory()["buddies"]

        for uuid,buddy in inventory.items():
            if uuid == buddy_uuid:
                inventory[uuid] = new_data
                break


        File_Manager.update_individual_inventory(inventory, "buddies")
        await shared.client.broadcast_loadout()

        return inventory

    @staticmethod 
    async def favorite_all(**kwargs):
        payload = json.loads(kwargs.get("payload"))
        favorite = payload["favorite"]

        inventory = File_Manager.fetch_individual_inventory()["buddies"]
        for uuid,buddy in inventory.items():
            for instance_uuid,instance in buddy["instances"].items():
                if not instance["locked"]:
                    instance["favorite"] = favorite

        File_Manager.update_individual_inventory(inventory, "buddies")
        await shared.client.broadcast_loadout()

        return inventory

    @staticmethod
    def refresh_buddy_inventory():
        valclient = shared.client.client
        client = shared.client

        old_data = None

        try:
            old_data = File_Manager.fetch_individual_inventory()["buddies"]
        except KeyError:
            old_data = None
        except Exception as e:
            logger_errors.error(traceback.format_exc())
            logger.debug("making fresh buddy database")
            Buddy_Manager.generate_blank_skin_database()

        buddy_entitlements = Entitlement_Manager.fetch_entitlements(valclient, "buddy")["Entitlements"]

        sanitized_buddy_entitlements = {}
        for entitlement in buddy_entitlements:
            if not entitlement["ItemID"] in sanitized_buddy_entitlements.keys():
                sanitized_buddy_entitlements[entitlement["ItemID"]] = []
            sanitized_buddy_entitlements[entitlement["ItemID"]].append(entitlement["InstanceID"])

        inventory = {}

        # iterate through each buddy
        for buddy in client.all_buddy_data:
            buddy_owned = False 
            owned_level_id = ""
            levels = [level["uuid"] for level in buddy["levels"]]

            if UNLOCK_ALL_BUDDIES:
                buddy_owned = True 

            for level in levels:
                if level in sanitized_buddy_entitlements.keys():
                    buddy_owned = True 
                    owned_level_id = level
                    break
            
            if buddy_owned:
                buddy_payload = {}
                existing_buddy_data = None

                if old_data is not None:
                    try:
                        existing_buddy_data = old_data[buddy["uuid"]]
                    except:
                        pass

                buddy_payload["display_name"] = buddy["displayName"]
                buddy_payload["uuid"] = buddy["uuid"]
                buddy_payload["display_icon"] = buddy["displayIcon"]
                buddy_payload["level_uuid"] = owned_level_id
                buddy_payload["instance_count"] = len(sanitized_buddy_entitlements[owned_level_id])

                buddy_payload["instances"] = {}

                for instance in sanitized_buddy_entitlements[owned_level_id]:
                    try:
                        buddy_payload["instances"][instance] = {
                            "uuid": instance,
                            "favorite": existing_buddy_data["instances"][instance]["favorite"] if existing_buddy_data is not None else False,
                            "super_favorite": existing_buddy_data["instances"][instance]["super_favorite"] if existing_buddy_data is not None else False,
                            "locked": existing_buddy_data["instances"][instance]["locked"] if existing_buddy_data is not None else False,
                            "locked_weapon_uuid": existing_buddy_data["instances"][instance]["locked_weapon_uuid"] if existing_buddy_data is not None else "",
                            "locked_weapon_display_name": existing_buddy_data["instances"][instance]["locked_weapon_display_name"] if existing_buddy_data is not None else "",
                        }

                    # remove me later
                    except:
                        buddy_payload["instances"][instance] = {
                            "uuid": instance,
                            "favorite": False,
                            "super_favorite": False,
                            "locked": False,
                            "locked_weapon_uuid": "",
                            "locked_weapon_display_name": "",
                        }


                # check for invalid favorite/lock combinations
                for instance in buddy_payload["instances"].values():
                    if instance["locked"]:
                        instance["favorite"] = False
                        if instance["locked_weapon_uuid"] == "" or instance["locked_weapon_display_name"] == "":
                            instance["locked"] = False
                            instance["locked_weapon_uuid"] = ""
                            instance["locked_weapon_display_name"] = ""


                inventory[buddy["uuid"]] = buddy_payload

        sort = sorted(inventory.items(), key=lambda x: x[1]["display_name"].lower())
        inventory = {k: v for k, v in sort}

        logger_inv.debug(f"buddy inventory:\n{json.dumps(inventory)}")
        File_Manager.update_individual_inventory(inventory,"buddies")
        return True