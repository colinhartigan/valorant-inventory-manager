import logging, os, sys
import logging.config
from ..file_utilities.filepath import Filepath

from ..client_config import DEBUG

class Logger:
    
    @staticmethod
    def create_logger():
        # create logger
        LOGGING_CONFIG = { 
            'version': 1,
            'formatters': { 
                'standard': { 
                    'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
                },
            },
            'handlers': {
                'debug_console_handler': {
                    'level': 'DEBUG',
                    'formatter': 'standard',
                    'class': 'logging.StreamHandler',
                    'stream': 'ext://sys.stdout',
                },
                'debug_file_handler': {
                    'level': 'DEBUG',
                    'formatter': 'standard',
                    'class': 'logging.FileHandler',
                    'filename': Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'vim.log')),
                    'mode': 'w',
                },
                'null': {
                    'level': 'DEBUG',
                    'formatter': 'standard',
                    'class': 'logging.StreamHandler',
                    'stream': '',
                },
            },
            'loggers': { 
                'VIM_main': {  # root logger
                    'handlers': [
                        'debug_console_handler', 
                        'debug_file_handler'
                    ] if DEBUG else [
                        'debug_file_handler'
                    ], # only print to console if in debug mode
                    'level': 'DEBUG',
                    'propagate': True
                },
                'VIM_inventory': {
                    'handlers': ['debug_file_handler'],
                    'level': 'DEBUG',
                    'propagate': True
                },
                'VIM_errors': {
                    'handlers': ['debug_console_handler', 'debug_file_handler'],
                    'level': 'DEBUG',
                    'propagate': True
                },


                'websockets.server': {
                    'handlers': ['debug_file_handler'],
                    'level': 'DEBUG',
                    'propagate': True
                },
                'urllib3.connectionpool': {
                    'handlers': ['debug_file_handler'],
                    'level': 'DEBUG',
                    'propagate': True
                }
            } 
        }
        logging.config.dictConfig(LOGGING_CONFIG)
        #print([logging.getLogger(name) for name in logging.root.manager.loggerDict])
        logger = logging.getLogger('VIM_main')

        # logging.basicConfig(handlers=[
        #                         logging.FileHandler(Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'vsm.log')), 'w', 'utf-8'),
        #                         logging.StreamHandler(sys.stdout),
        #                     ],
        #                     format='%(asctime)s.%(msecs)d %(name)s %(levelname)s %(message)s',
        #                     datefmt='%H:%M:%S',
        #                     level=logging.DEBUG)


        logger.debug("created log")
