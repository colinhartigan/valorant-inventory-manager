import json

from . import shared

async def broadcast(payload):
    #print(f"broadcasting event {payload['event']}")
    for socket in shared.sockets:
        try:
            await socket.send(json.dumps(payload))
        except:
            print("couldn't broadcast to someone")
