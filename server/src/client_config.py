from valclient import Client

# version
CLIENT_VERSION = "1.0.0"

# debug settings
DEBUG = False
UNLOCK_ALL_SKINS = False
FORCE_ONBOARDING = False
AUTH_MODE = "local" # local or credentials
CLIENT_STATE_REFRESH_INTERVAL = 5

# client overrides
COLLECTIONS_WITH_BAD_LEVEL_IMAGES = ["975f7716-498d-8e0b-b7c7-02b507b8e14a", "9436fe00-4156-e115-b11f-f69cac91a6a5", "8a34391f-4d1f-6b22-859f-628bff79d381"]

# other definitions
DEFAULT_CONFIG = {
    "app": {
        "type": "section",
        "display": "App Settings",
        "settings": {
            "version": {
                "type": "string",
                "locked": True,
                "value": CLIENT_VERSION,
            },
            "onboarding_completed": {
                "type": "string",
                "display": "Onboarding Completed",
                "description": "Disable this if you want to redo the onboarding process on the next launch.",
                "value": False,
            },
        }
    },

    "client": {
        "type": "section",
        "display": "VALORANT Client Settings",
        "settings": {
            "region": {
                "type": "list_selection",
                "display": "Region",
                "description": "Game region (found in settings > about).",
                "value": "na",
                "options": Client.fetch_regions()
            },

            "use_credential_auth": {
                "type": "bool",
                "display": "Use Credential Authentication",
                "description": "Use Riot credential authentication; this allows you to use VSM while the game is not running. Disable this option if you are uncomfortable inputting your credentials. Credentials are stored locally and are only sent to Riot servers for authentication.",
                "value": False,
            },

            "username": {
                "type": "string",
                "display": "Riot Account Username",
                "value": "",
            },
            "password": {
                "type": "string",
                "display": "Riot Account Username",
                "value": "",
            }
        }
    },

    "randomizer": {
        "type": "section",
        "display": "Randomizer Settings",
        "settings": {
            "auto_skin_randomize": {
                "type": "bool",
                "display": "Automatically Randomize Skins",
                "description": "Automatically randomize skins after a match ends.",
                "value": True,
            }
        }
    }
}


DEBUG_PRINT = lambda x: print(x) if DEBUG else x