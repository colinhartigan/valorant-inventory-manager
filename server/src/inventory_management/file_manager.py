from ..file_utilities.filepath import Filepath
import os, json

class File_Manager:

    client = None

    @staticmethod 
    def fetch_inventory(client):
        try:
            with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'inventory.json'))) as f:
                return json.load(f)
        except:
            return File_Manager.create_empty_inventory(client)

    @staticmethod
    def create_empty_inventory(client):
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'inventory.json')), 'w+') as f:
            region = client.region
            puuid = client.puuid
            data = {
                puuid: {
                    region: {}
                }
            }
            json.dump(data, f)

    @staticmethod
    def fetch_individual_inventory(client):
        region = client.region
        puuid = client.puuid 

        inventory = File_Manager.fetch_inventory(client)
        return inventory[puuid][region]

    @staticmethod
    def update_individual_inventory(client,new_data,content_type):
        current = File_Manager.fetch_inventory(client)
        region = client.region
        puuid = client.puuid
        current[puuid][region][content_type] = new_data
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'inventory.json')),'w') as f:
            json.dump(current,f)

    @staticmethod
    def update_inventory(new_data):
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'inventory.json')),'w') as f:
            json.dump(new_data,f)