import asyncio
import websockets, json

from .client_manager.client import Client

class Server:

    client = Client()
    socket = None

    @staticmethod
    def start():

        start_server = websockets.serve(Server.entrypoint, "localhost", 8765)
        
        print("running")
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

    @staticmethod
    async def entrypoint(websocket, path):
        print("connected")
        Server.socket = websocket
        while True:
            print("waiting for req")
            request = await websocket.recv()
            print("got a request")
            print(f"request: {request}")

            await websocket.send(json.dumps(Server.client.fetch_loadout()))
            print("responded w/ payload\n----------------------")