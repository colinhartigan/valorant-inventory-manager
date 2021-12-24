import websockets, json, traceback, os, asyncio, inspect
import websockets.client 
import websockets.server
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError

from .client_management.client import Client
from .inventory_management.skin_manager import Skin_Manager
from .randomizers.skin_randomizer import Skin_Randomizer
from .session_management.client_state import Client_State

from .sys_utilities.system import System
from .file_utilities.filepath import Filepath

from .user_configuartion.config import Config
from .client_config import DEBUG_PRINT, FORCE_ONBOARDING
from . import shared


class Server:

    shared.client = Client()
    shared.client.connect()

    request_lookups = {
        "handshake": lambda: True,
        "get_onboarding_state": lambda: shared.config["app"]["settings"]["onboarding_completed"]["value"] if FORCE_ONBOARDING == False else False,

        # system stuff
        "start_game": System.start_game,
        "get_running_state": System.are_processes_running,
        "autodetect_account": shared.client.autodetect_account,

        # client stuff
        "fetch_loadout": shared.client.fetch_loadout,
        "refresh_inventory": Skin_Manager.update_skin_database,
        "randomize_skins": Skin_Randomizer.randomize,
        "fetch_inventory": Skin_Manager.fetch_inventory,
        "put_weapon": shared.client.put_weapon,
        "update_inventory": Skin_Manager.update_inventory,
    }

    @staticmethod
    def start():
        if not os.path.exists(Filepath.get_appdata_folder()):
            os.mkdir(Filepath.get_appdata_folder())

        if not shared.client.ready:
            Server.reset_valclient()
        print(shared.client.ready)
        
        shared.loop = asyncio.get_event_loop()

        Config.init_config()

        # iniitalize any submodules
        client_state = Client_State()

        #start websocket server
        start_server = websockets.serve(Server.ws_entrypoint, "", 8765)

        print("refreshing inventory")
        if shared.client.ready:
            Server.request_lookups["refresh_inventory"]()
        
        print("server running\nopen https://colinhartigan.github.io/valorant-skin-manager in your browser to use")
        shared.loop.run_until_complete(start_server)

        # initialize any asynchronous submodules
        shared.loop.run_until_complete(client_state.loop())

        shared.loop.run_forever()


    def reset_valclient():
        shared.client = Client()
        try:
            shared.client.connect()
        except: 
            print("couldnt connect")


    @staticmethod
    async def ws_entrypoint(websocket, path):
        print("connected")
        DEBUG_PRINT(shared.sockets)
        shared.sockets.append(websocket)
        try:
            while websocket in shared.sockets:
                data = await websocket.recv()
                data = json.loads(data)

                request = data.get("request")
                args = data.get("args")
                has_kwargs = True if args is not None else False
                DEBUG_PRINT("got a request")
                DEBUG_PRINT(f"request: {request}")
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
                DEBUG_PRINT("responded w/ payload\n----------------------")
        
        except ConnectionClosedOK:
            print("disconnected")
            shared.sockets.pop(shared.sockets.index(websocket))

        except ConnectionClosedError:
            print("disconnected w/ error")
            shared.sockets.pop(shared.sockets.index(websocket))
            
        except Exception:
            print("----- EXCEPTION -----")
            print(traceback.print_exc())

        except:
            print("idk what even happened to get here")


