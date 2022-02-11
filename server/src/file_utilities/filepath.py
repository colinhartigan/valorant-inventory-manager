import os
import sys

from ..client_config import USE_TEST_DIRECTORY

directory = "valorant-inventory-manager" if not USE_TEST_DIRECTORY else "valorant-inventory-manager-debug"

class Filepath:
    @staticmethod 
    def get_path(relative_path):
        if hasattr(sys, '_MEIPASS'): 
            return os.path.join(sys._MEIPASS, relative_path)
        return os.path.join(os.path.abspath("."), relative_path)

    @staticmethod 
    def get_appdata_folder():
        return Filepath.get_path(os.path.join(os.getenv('APPDATA'), directory))

    @staticmethod
    def get_programdata_folder():
        return Filepath.get_path(os.path.join(os.getenv('PROGRAMDATA'), directory))