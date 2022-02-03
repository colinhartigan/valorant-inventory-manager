import json, logging

from . import shared
logger = logging.getLogger('VIM_main')

async def broadcast(payload):
    #print(f"broadcasting event {payload['event']}")
    for socket in shared.sockets:
        try:
            await socket.send(json.dumps(payload))
        except:
            logging.warning("couldn't broadcast to someone")
