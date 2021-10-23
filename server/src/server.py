import asyncio
import websockets, json, traceback, os
from websockets.exceptions import ConnectionClosedOK 

from .client_management.client import Client
from .inventory_management.skin_loader import Skin_Loader
from .file_utilities.filepath import Filepath

db = True
dbprint = lambda x: print(x) if db else x

class Server:

    client = Client()

    # send client object to submodules
    Skin_Loader.client = client

    sockets = []

    request_lookups = {
        "handshake": lambda: True,
        "fetch_loadout": client.fetch_loadout,
        "refresh_inventory": Skin_Loader.update_skin_database,
        "fetch_inventory": Skin_Loader.fetch_inventory,
        "put_weapon": client.put_weapon,
    }

    @staticmethod
    def start():

        if not os.path.exists(Filepath.get_appdata_folder()):
            os.mkdir(Filepath.get_appdata_folder())

        start_server = websockets.serve(Server.ws_entrypoint, "", 8765)

        Server.request_lookups["refresh_inventory"]()
        
        print("server running")
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

    @staticmethod
    async def ws_entrypoint(websocket, path):
        dbprint("connected")
        dbprint(Server.sockets)
        Server.sockets.append(websocket)
        try:
            while websocket in Server.sockets:
                dbprint("waiting for req")
                data = await websocket.recv()
                data = json.loads(data)

                request = data.get("request")
                args = data.get("args")
                has_kwargs = True if args is not None else False
                dbprint("got a request")
                dbprint(f"request: {request}")
                payload = {}

                if request in Server.request_lookups.keys():
                    payload = {
                        "success": True,
                        "request": request,
                        "response": None,
                    }
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
                dbprint("responded w/ payload\n----------------------")
        
        except ConnectionClosedOK:
            dbprint("disconnected")
            Server.sockets.pop(Server.sockets.index(websocket))
            
        except Exception:
            print("----- EXCEPTION -----")
            print(traceback.print_exc())