import pandas as pd
import numpy as np

from datetime import datetime
from glob import glob
import os
import sys
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from script_builder.models import MungerBuilder

from jinja2 import Template, Environment, PackageLoader

# class PandasScriptWriter(object):
#
#     def __init__(self, munger):
#         self.munger = munger

def print_run_status(run_start_time,message):
    print('\n{0} - {1}'.format(datetime.now()-run_start_time, message))

def main(munger_builder_id=1):

    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    jinja_env = Environment(trim_blocks=True, lstrip_blocks=True,
        loader=PackageLoader('script_builder', 'templates/munger_templates'),
    )

    jinja_template = jinja_env.get_template(os.path.basename(mb.munger_template))

    script_string = jinja_template.render(mb=mb)

    with open('media/user_munger_scripts/{0}.py'.format(mb.safe_file_name), 'w+') as mf:
        mf.write(script_string+'\n')

    return script_string

if __name__ == '__main__':
    main(munger_builder_id=1)
