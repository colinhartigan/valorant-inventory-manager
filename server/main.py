import os, traceback, logging
from src.server import Server
from src.client_config import SERVER_VERSION

logger = logging.getLogger('VIM_main')
logger_errors = logging.getLogger('VIM_errors')

if __name__ == "__main__":
    try:
        print(f'''  _   ________  ___
 | | / /  _/  |/  /
 | |/ // // /|_/ / 
 |___/___/_/  /_/ v{SERVER_VERSION}  
''')
        os.system("title VIM Client Companion")
        Server.start()
    except:
        logger_errors.error("error: please create an issue with the traceback below if this problem persists")
        logger_errors.error(traceback.format_exc())
        input("press enter to exit...")
        os._exit(1)
    