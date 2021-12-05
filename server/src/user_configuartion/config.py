import json, os, copy

from ..file_utilities.filepath import Filepath
from .. import shared
from ..client_config import DEFAULT_CONFIG

class Config:

    def init_config():
        try:
            with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), "config.json"))) as f:
                config = json.load(f)
                
                shared.config = config
        except:
            Config.create_default_config()
            Config.init_config()

        Config.check_config()


    def create_default_config():
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), "config.json")), "w") as f:
            json.dump(DEFAULT_CONFIG, f)

    def save_config():
        with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), "config.json")), "w") as f:
            json.dump(shared.config, f)

    def check_config():
        config = copy.deepcopy(shared.config)

        def check_next_layer(default, current):
            for key,default_value in default.items():

                # check for missing config keys
                if key not in current.keys():
                    current[key] = default_value

                # check for missing settings
                for setting_key, setting_value in default_value.items():
                    if setting_key not in current[key].keys():
                        current[key][setting_key] = setting_value

                # valid config types are
                # section, string, int, bool, list_selection 

                # if the config value is locked, make sure it's what it should be
                if default_value.get("locked") == True:
                    current[key]["value"] = default_value["value"]

                # if the config value has options, make sure the options are updated
                if default_value.get("options") is not None:
                    current[key]["options"] = default_value["options"]

                if default_value.get("display"):
                    current[key]["display"] = default_value["display"]

                if default_value.get("description"):
                    current[key]["description"] = default_value["description"]

                if default_value.get("type") == "section":
                    check_next_layer(default_value["settings"], current[key]["settings"])

        check_next_layer(DEFAULT_CONFIG, config)

        shared.config = config
        Config.save_config()



                



    # def check_config():
    #     # ???????
    #     # my brain hurts
    #     # i bet theres a way better way to write this but im just braindead
    #     config = Config.fetch_config()
        
    #     def check_for_new_vars(blank,current):
    #         for key,value in blank.items():
    #             if not key in current.keys():
    #                 current[key] = value
    #             if type(value) != type(current[key]):
    #                 # if type of option is changed
    #                 current[key] = value
    #             if key == "version": 
    #                 # version can't be changed by the user lmao
    #                 current[key] = value
    #             if key == "region": 
    #                 current[key][1] = Client.fetch_regions() # update regions jic ya know
    #             if isinstance(value,list):
    #                 current[key][1] = blank[key][1]
    #             if isinstance(value,dict):
    #                 check_for_new_vars(value,current[key])
            
    #     def remove_unused_vars(blank,current):
    #         def check(bl,cur):
    #             for key,value in list(cur.items()):
    #                 if not key in bl.keys():
    #                     del cur[key]
    #                 if isinstance(value,dict) and key in list(cur.keys()):
    #                     check(bl[key],value)

    #         check(blank,current)
    #         return current

    #     check_for_new_vars(Config.default_config,config)
    #     config = remove_unused_vars(Config.default_config,config)
    #     Config.modify_config(config)

    # @staticmethod
    # def fetch_config():
    #     try:
    #         with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), "config.json"))) as f:
    #             config = json.load(f)
    #             return config
    #     except:
    #         return Config.create_default_config()

    # @staticmethod
    # def modify_config(new_config):
    #     with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), "config.json")), "w") as f:
    #         json.dump(new_config, f)

    #     return Config.fetch_config()

    # @staticmethod
    # def create_default_config():
    #     if not os.path.exists(Filepath.get_appdata_folder()):
    #         os.mkdir(Filepath.get_appdata_folder())
    #     with open(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), "config.json")), "w") as f:
    #         json.dump(Config.default_config, f)
    #     return Config.fetch_config() 