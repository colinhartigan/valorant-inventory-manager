import websockets, json, traceback, os, asyncio, inspect, logging
import websockets.client 
import websockets.server
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError

from .client_management.client import Client
from .session_management.client_state import Client_State

from .inventory_management.profile_manager import Profile_Manager
from .inventory_management.skin_manager import Skin_Manager
from .randomizers.skin_randomizer import Skin_Randomizer
from .inventory_management.buddy_manager import Buddy_Manager
from .randomizers.buddy_randomizer import Buddy_Randomizer

from .sys_utilities.system import System
from .file_utilities.filepath import Filepath
from .sys_utilities.logging import Logger

from .user_configuartion.config import Config
from .client_config import SERVER_VERSION, IS_TEST_BUILD
from . import shared

logger_errors = logging.getLogger('VIM_errors')
logger = logging.getLogger('VIM_main')

class Server:

    shared.client = Client()
    shared.client.connect()

    request_lookups = {
        "handshake": lambda: True,
        "get_server_version": lambda: SERVER_VERSION,

        # system stuff
        "start_game": System.start_game,
        "get_running_state": System.are_processes_running,
        "autodetect_account": shared.client.autodetect_account,

        # config stuff
        "fetch_config": lambda: shared.config,
        "update_config": Config.update_config,

        # inventory/loadout stuff
        "fetch_loadout": shared.client.fetch_loadout,
        "fetch_inventory": Skin_Manager.fetch_inventory,
        "fetch_profiles": Profile_Manager.fetch_profiles,

        "refresh_profiles": Profile_Manager.refresh_profiles,
        "refresh_skin_inventory": Skin_Manager.refresh_skin_inventory,
        "refresh_buddy_inventory": Buddy_Manager.refresh_buddy_inventory,

        "randomize_skins": Skin_Randomizer.randomize,
        "randomize_buddies": Buddy_Randomizer.randomize,

        "put_weapon": shared.client.put_weapon,
        "put_buddies": shared.client.put_buddies,

        #"update_skin_inventory": Skin_Manager.update_inventory,
        "update_buddy_inventory": Buddy_Manager.update_inventory,

        # profile stuff
        "create_profile": Profile_Manager.generate_empty_profile,
        "fetch_profile_metadatas": Profile_Manager.fetch_profile_metadata,
        "update_profiles": Profile_Manager.update_profiles,
        "update_profile": Profile_Manager.update_profile,
        "fetch_profile": Profile_Manager.fetch_profile,
        "apply_profile": Profile_Manager.apply_profile,
        
        "favorite_all_buddies": Buddy_Manager.favorite_all,

        # game state stuff
        "force_update_game_state": Client_State.update_game_state,
    }

    @staticmethod
    def start():
        if not os.path.exists(Filepath.get_appdata_folder()):
            os.mkdir(Filepath.get_appdata_folder())

        Logger.create_logger()
        
        shared.loop = asyncio.get_event_loop()

        Config.init_config()

        # iniitalize any submodules
        client_state = Client_State()

        #start websocket server
        start_server = websockets.serve(Server.ws_entrypoint, "", 8765)
        
        print(f"open {'https://colinhartigan.github.io/valorant-inventory-manager' if not IS_TEST_BUILD else 'https://colinhartigan.github.io/VIM-test-client'} in your browser to use VIM")
        shared.loop.run_until_complete(start_server)

        # initialize any asynchronous submodules
        shared.loop.run_until_complete(client_state.loop())

        shared.loop.run_forever()


    @staticmethod
    async def ws_entrypoint(websocket, path):
        logger.debug("a client connected")
        logger.debug(shared.sockets)
        shared.sockets.append(websocket)
        try:
            while websocket in shared.sockets:
                data = await websocket.recv()
                data = json.loads(data)

                request = data.get("request")
                args = data.get("args")
                has_kwargs = True if args is not None else False
                logger.debug(f"request: {request}")
                payload = {}

                if request in Server.request_lookups.keys():
                    payload = {
                        "success": True,
                        "event": request,
                        "data": None,
                    }
                    if inspect.iscoroutinefunction(Server.request_lookups[request]):
                        if has_kwargs:
                            payload["data"] = await Server.request_lookups[request](**args)
                        else:
                            payload["data"] = await Server.request_lookups[request]()
                    else:
                        if has_kwargs:
                            payload["data"] = Server.request_lookups[request](**args)
                        else:
                            payload["data"] = Server.request_lookups[request]()
                else:
                    payload = {
                        "success": False,
                        "data": "could not find the specified request"
                    }

                await websocket.send(json.dumps(payload))
                logger.debug(f"response:\n{json.dumps(payload)} ")
        
        except ConnectionClosedOK:
            logger.info("disconnected")
            shared.sockets.pop(shared.sockets.index(websocket))

        except ConnectionClosedError:
            logger.info("disconnected w/ error")
            shared.sockets.pop(shared.sockets.index(websocket))
            
        except Exception:
            logger_errors.error("----- EXCEPTION -----")
            logger_errors.error(traceback.format_exc())

        except:
            logger.error("idk what even happened to get here")


