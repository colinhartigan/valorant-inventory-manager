import os, json, logging
from ..file_utilities.filepath import Filepath

logger_errors = logging.getLogger('VIM_errors')

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
                    data = File_Manager.add_region()
                return data
        except:
            logger_errors.error("could not load inventory")
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
            return File_Manager.add_region()
                
                    

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

    def add_region():
        client = shared.client.client
        data = File_Manager.fetch_inventory()
        region = client.region
        puuid = client.puuid 
        shard = client.shard 
        data[puuid][region][shard] = {}
        File_Manager.update_inventory(data)
        return data


    @staticmethod
    def update_inventory(new_data):
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'inventory.json')),'w') as f:
            json.dump(new_data,f)