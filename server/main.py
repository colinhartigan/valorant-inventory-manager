import os, traceback
from src.server import Server
from src.client_config import SERVER_VERSION

if __name__ == "__main__":
    try:
        print(f'''  _   ________  ___
 | | / /  _/  |/  /
 | |/ // // /|_/ / 
 |___/___/_/  /_/ v{SERVER_VERSION}  
''')
        Server.start()
    except:
        print("error: please create an issue with the traceback below if this problem persists")
        traceback.print_exc()
        input("press enter to exit...")
        os._exit(1)
    