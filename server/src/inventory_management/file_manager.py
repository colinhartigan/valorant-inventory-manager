from ..file_utilities.filepath import Filepath
import os, json

class File_Manager:

    @staticmethod 
    def fetch_skin_inventory():
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'skins.json'))) as f:
            return json.load(f)
