import asyncio
import websockets, json

from .client_manager.client import Client

class Server:

    client = Client()
    sockets = []

    request_lookups = {
        "fetch_loadout": client.fetch_loadout
    }

    @staticmethod
    def start():

        start_server = websockets.serve(Server.entrypoint, "", 8765)
        
        print("running")
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

    @staticmethod
    async def entrypoint(websocket, path):
        print("connected")
        Server.sockets.append(websocket)
        while True:
            print("waiting for req")
            data = await websocket.recv()
            request = json.loads(data)["request"]
            print("got a request")
            print(f"request: {request}")
            payload = {}

            if request in Server.request_lookups.keys():
                payload = {
                    "success": True,
                    "request": request,
                    "response": None,
                }
                payload["response"] = Server.request_lookups[request]()
            else:
                payload = {
                    "success": False,
                    "response": "could not find the specified request"
                }

            await websocket.send(json.dumps(payload))
            print("responded w/ payload\n----------------------")