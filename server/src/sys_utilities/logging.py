import logging
import os
from ..file_utilities.filepath import Filepath

class Logger:
    
    @staticmethod
    def create_logger():
        # create logger
        logging.basicConfig(filename=Filepath.get_path(os.path.join(Filepath.get_appdata_folder(), 'vsm.log')),
                            filemode='w',
                            format='%(asctime)s.%(msecs)d %(name)s %(levelname)s %(message)s',
                            datefmt='%H:%M:%S',
                            level=logging.DEBUG)

        logger = logging.getLogger('skincli')
        logger.debug("created log")