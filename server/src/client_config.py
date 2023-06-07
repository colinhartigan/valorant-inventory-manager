from valclient import Client

# version
SERVER_VERSION = "1.2.1"

# debug settings
IS_TEST_BUILD = False # directs to the test client website

DEBUG = False # prints all log messages to console

FORCE_DEFAULT_SKINS = False # only deafult skins unlocked
UNLOCK_ALL_SKINS = False # just for testing purposes, doesn't actually unlock anything
UNLOCK_ALL_BUDDIES = False # just for testing purposes, doesn't actually unlock anything

USE_TEST_DIRECTORY = False # use a different directory for testing purposes
AUTH_MODE = "local" # local or credentials
CLIENT_STATE_REFRESH_INTERVAL = 5

# client overrides
COLLECTIONS_WITH_BAD_LEVEL_IMAGES = ["975f7716-498d-8e0b-b7c7-02b507b8e14a", "9436fe00-4156-e115-b11f-f69cac91a6a5", "8a34391f-4d1f-6b22-859f-628bff79d381"] # collections with bad LEVEL images in valorant-api

# other definitions
DEFAULT_CONFIG = {
    "app": {
        "type": "section",
        "display": "App Settings",
        "settings": {
            "version": {
                "type": "string",
                "display": "Version",
                "description": "VIM client companion version",
                "value": SERVER_VERSION,
                "attrs": ["locked"]
            },
            "show_locked_skins": {
                "type": "bool",
                "display": "Show locked skins",
                "description": "Show skins you haven't unlocked yet",
                "value": False,
            }
        }
    },

    "client": {
        "type": "section",
        "display": "VALORANT Client Settings",
        "settings": {
            # "region": {
            #     "type": "list_select",
            #     "display": "Region",
            #     "description": "Game region (found in settings > about).",
            #     "value": "na",
            #     "options": Client.fetch_regions()
            # },
        }
    },

    "skin_randomizer": {
        "type": "section",
        "display": "Skin Randomizer Settings",
        "settings": {
            "prevent_randomizer_repeats": {
                "type": "bool",
                "display": "Prevent repeats",
                "description": "If multiple skins are favorited, guarantee that a skin isn't repeated in the randomizer.",
                "value": False,
            },
            "auto_skin_randomize": {
                "type": "bool",
                "display": "Automatically randomize skins",
                "description": "Automatically randomize favorite skins after a match ends.",
                "value": True,
            },
            "randomize_after_range": {
                "type": "bool",
                "display": "Randomize skins after leaving range",
                "description": "Automatically randomize favorite skins after leaving the range (DISABLE if you don't want your skins to randomize every time you leave the range)",
                "value": False,
            }
        }
    },
    "buddy_randomizer": {
        "type": "section",
        "display": "Buddy Randomizer Settings",
        "settings": {
            "auto_skin_randomize": {
                "type": "bool",
                "display": "Automatically randomize buddies",
                "description": "Automatically randomize favorite buddies after a match ends.",
                "value": True,
            },
        }
    }
}