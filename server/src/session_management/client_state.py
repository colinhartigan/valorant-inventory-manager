import asyncio, traceback, json

from ..randomizers.skin_randomizer import Skin_Randomizer

from ..client_config import CLIENT_STATE_REFRESH_INTERVAL
from .. import shared 

class Client_State:

    def __init__(self):
        self.client = shared.client
        self.valclient = shared.client.client

        try:
            self.previous_presence = self.valclient.fetch_presence()
        except:
            self.previous_presence = {}
        self.presence = self.previous_presence
        self.ingame = False

    async def randomizer_check(self):
        if self.presence is not None and self.presence != {}:
            if (self.presence["sessionLoopState"] != self.previous_presence["sessionLoopState"]) and (self.previous_presence["sessionLoopState"] == "INGAME" and self.presence["sessionLoopState"] == "MENUS"):
                Skin_Randomizer.randomize() 

    async def loop(self):
        while True:
            self.previous_presence = self.presence 

            try:
                self.presence = self.valclient.fetch_presence()
                if self.previous_presence["sessionLoopState"] == "INGAME" or self.presence["sessionLoopState"] == "PREGAME":
                    self.ingame = True
                else:
                    self.ingame = False
            except:
                print("not running in local mode, cannot fetch presence anymore")
                # SWITCH TO THE OTHER MODE IF USERNAME AND PASSWORD ARE SET

            await Client_State.update_game_state(self.ingame)
            await self.randomizer_check()
        
            await asyncio.sleep(CLIENT_STATE_REFRESH_INTERVAL)

    async def update_game_state(state):
        payload = {
            "event": "game_state",
            "data": {
                "state": state
            }
        }
        for socket in shared.sockets:
            await socket.send(json.dumps(payload))
                