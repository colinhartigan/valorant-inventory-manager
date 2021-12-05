import websockets, json, traceback, os, ssl, pathlib, asyncio, inspect
import websockets.client 
import websockets.server
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError

from .client_management.client import Client
from .inventory_management.skin_loader import Skin_Loader
from .randomizers.skin_randomizer import Skin_Randomizer
from .session_management.client_state import Client_State

from .sys_utilities.system import System
from .file_utilities.filepath import Filepath

from .user_configuartion.config import Config
from .client_config import DEBUG_PRINT
from . import shared



class Server:

    client = Client()
    try:
        client.connect()
    except: 
        onboarding = True
        
    request_lookups = {
        "handshake": lambda: True,

        # system stuff
        "start_game": System.start_game,
        "get_running_state": System.are_processes_running,
        "autodetect_account": client.autodetect_account,

        # client stuff
        "fetch_loadout": client.fetch_loadout,
        "refresh_inventory": Skin_Loader.update_skin_database,
        "randomize_skins": Skin_Randomizer.randomize,
        "fetch_inventory": Skin_Loader.fetch_inventory,
        "put_weapon": client.put_weapon,
        "update_inventory": Skin_Loader.update_inventory,
    }

    @staticmethod
    def start():
        if not os.path.exists(Filepath.get_appdata_folder()):
            os.mkdir(Filepath.get_appdata_folder())

        shared.client = Server.client

        Config.init_config()

        # iniitalize any submodules
        client_state = Client_State()

        #start websocket server
        start_server = websockets.serve(Server.ws_entrypoint, "", 8765)

        print("refreshing inventory")
        if shared.client.ready:
            Server.request_lookups["refresh_inventory"]()
        
        print("server running\nopen https://colinhartigan.github.io/valorant-skin-manager in your browser to use")
        asyncio.get_event_loop().run_until_complete(start_server)

        # initialize any asynchronous submodules
        asyncio.get_event_loop().run_until_complete(client_state.loop())

        asyncio.get_event_loop().run_forever()


    @staticmethod
    async def ws_entrypoint(websocket, path):
        DEBUG_PRINT("connected")
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
                        "request": request,
                        "response": None,
                    }
                    if inspect.iscoroutinefunction(Server.request_lookups[request]):
                        if has_kwargs:
                            payload["response"] = await Server.request_lookups[request](**args)
                        else:
                            payload["response"] = await Server.request_lookups[request]()
                    else:
                        if has_kwargs:
                            payload["response"] = Server.request_lookups[request](**args)
                        else:
                            payload["response"] = Server.request_lookups[request]()
                else:
                    payload = {
                        "success": False,
                        "response": "could not find the specified request"
                    }

                await websocket.send(json.dumps(payload))
                DEBUG_PRINT("responded w/ payload\n----------------------")
        
        except ConnectionClosedOK:
            DEBUG_PRINT("disconnected")
            shared.sockets.pop(shared.sockets.index(websocket))

        except ConnectionClosedError:
            shared.sockets.pop(shared.sockets.index(websocket))
            
        except Exception:
            print("----- EXCEPTION -----")
            print(traceback.print_exc())