import os, json, logging
from ..file_utilities.filepath import Filepath

logger_errors = logging.getLogger('VIM_errors')
logger = logging.getLogger('VIM_main')

from .. import shared

class File_Manager:

    @staticmethod 
    def fetch_inventory():
        client = shared.client.client
        region = client.region
        puuid = client.puuid 
        shard = client.shard
        try:
            with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'inventory.json'))) as f:
                data = json.load(f)
                try:
                    x = data[puuid][region][shard]
                except KeyError:
                    data = File_Manager.add_region(data, 'inventory.json')
                return data
        except:
            logger.debug("could not load inventory, creating an empty one")
            return File_Manager.create_empty_inventory()

    @staticmethod
    def create_empty_inventory():
        client = shared.client.client
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'inventory.json')), 'w+') as f:
            region = client.region
            puuid = client.puuid
            shard = client.shard
            data = {
                puuid: {
                    region: {
                        shard: {}
                    }
                }
            }
            json.dump(data, f)
            return data

    @staticmethod 
    def fetch_profiles():
        client = shared.client.client
        region = client.region
        puuid = client.puuid 
        shard = client.shard
        try:
            with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'profiles.json'))) as f:
                data = json.load(f)
                try:
                    x = data[puuid][region][shard]
                except KeyError:
                    data = File_Manager.add_region(data, 'profiles.json')
                return data
        except:
            logger.debug("could not load profiles database, creating an empty one")
            return File_Manager.create_empty_profiles()

    @staticmethod
    def create_empty_profiles():
        client = shared.client.client
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'profiles.json')), 'w+') as f:
            region = client.region
            puuid = client.puuid
            shard = client.shard
            data = {
                puuid: {
                    region: {
                        shard: []
                    }
                }
            }
            json.dump(data, f)
            return data

    @staticmethod
    def fetch_individual_inventory():
        client = shared.client.client
        region = client.region
        puuid = client.puuid
        shard = client.shard

        inventory = File_Manager.fetch_inventory()
        try:
            return inventory[puuid][region][shard]
        except:
            return File_Manager.add_region(inventory, 'inventory.json')
        
    @staticmethod
    def fetch_individual_profiles():
        client = shared.client.client
        region = client.region
        puuid = client.puuid
        shard = client.shard

        profiles = File_Manager.fetch_profiles()
        try:
            return profiles[puuid][region][shard]
        except:
            return File_Manager.add_region(profiles, 'profiles.json')

    @staticmethod
    def update_individual_inventory(new_data,content_type):
        client = shared.client.client
        current = File_Manager.fetch_inventory()
        region = client.region
        shard = client.shard
        puuid = client.puuid
        current[puuid][region][shard][content_type] = new_data
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'inventory.json')),'w') as f:
            json.dump(current,f)

    @staticmethod
    def update_individual_profiles(new_data):
        client = shared.client.client
        current = File_Manager.fetch_profiles()
        region = client.region
        shard = client.shard
        puuid = client.puuid
        current[puuid][region][shard] = new_data
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'profiles.json')),'w') as f:
            json.dump(current,f)

    @staticmethod
    def add_region(data, destination):
        client = shared.client.client
        region = client.region
        puuid = client.puuid 
        shard = client.shard 
        if not data.get(puuid):
            data[puuid] = {}
        if not data[puuid].get(region):
            data[puuid][region] = {}
        if not data[puuid][region].get(shard):
            data[puuid][region][shard] = {}

        logger.debug(f"adding region: {region}, shard: {shard}, puuid: {puuid}")

        File_Manager.update_file(data, destination)
        return data

    @staticmethod
    def update_file(new_data, destination):
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), destination)),'w') as f:
            json.dump(new_data,f)