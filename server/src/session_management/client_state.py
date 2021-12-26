import asyncio, traceback, json

from ..randomizers.skin_randomizer import Skin_Randomizer
from ..sys_utilities.system import System
from ..broadcast import broadcast

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
                await Skin_Randomizer.randomize() 

    async def check_presence(self):
        self.previous_presence = self.presence 
        changed = False
        try:
            self.presence = self.valclient.fetch_presence()
            if self.presence["sessionLoopState"] == "INGAME" or self.presence["sessionLoopState"] == "PREGAME":
                self.ingame = True
            else:
                self.ingame = False

            if (self.presence["sessionLoopState"] != self.previous_presence["sessionLoopState"]):
                changed = True
        except:
            self.ingame = False 

        return changed

    async def check_game_running(self):
        await shared.client.check_connection()

    async def loop(self):
        while True:

            changed = await self.check_presence()
            await self.check_game_running()
            
            # check for randomizer
            await self.randomizer_check()

            if changed: #only need to broadcast this if the state actually changed
                await Client_State.update_game_state(self.ingame)
        
            await asyncio.sleep(CLIENT_STATE_REFRESH_INTERVAL)
            
    async def update_game_state(state):
        payload = {
            "event": "game_state",
            "data": {
                "state": state
            }
        }
        await broadcast(payload)