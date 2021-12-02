import os, traceback
from src.server import Server

if __name__ == "__main__":
    try:
        Server.start()
    except:
        print("error: please create an issue with the traceback below if this problem persists")
        traceback.print_exc()
        input("press enter to exit...")
        os._exit(1)
    