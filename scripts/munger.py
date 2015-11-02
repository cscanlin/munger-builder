from __future__ import print_function
import pandas as pd
import numpy as np

from datetime import datetime
from glob import glob
import os
import sys
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from script_builder.models import MungerBuilder

INPUT_FOLDER = os.path.join(os.path.expanduser("~"), 'Python Scripts', 'munger_builder','scripts')

OUTPUT_FOLDER = None

def print_status(start_time,message):
    print('\n{0} - {1}'.format(datetime.now()-start_time, message))

def main(munger_builder_id=1):
    # try:
    start_time = datetime.now()

    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    mb.input_folder = os.path.join(os.path.expanduser("~"), 'Python Scripts', 'munger_builder','scripts')

    if not mb.output_folder:
        mb.output_folder = mb.input_folder

    # Read data from singups with orders CSV from Looker and load into pandas DataFrame
    data_file_name = glob(os.path.join(mb.input_folder, mb.input_filename))[0]
    print_status(start_time, 'Reading Data From:\n' + data_file_name.replace('\\', '/'))

    df = pd.read_csv(data_file_name)

    #Create Pivot Table on Key and Write Output CSV
    print_status(start_time, 'Writing Output CSVs...')
    pivot_output = pd.pivot_table(
        df,
        index=mb.index_fields(),
        values=mb.agg_fields().keys(),
        aggfunc=mb.agg_fields(),
    )
    if mb.fields_to_rename():
        pivot_output = pivot_output.rename(columns=mb.fields_to_rename())

    print(pivot_output)
    yield pivot_output

    pivot_output.to_csv(os.path.join(mb.output_folder, mb.output_filename))

    print_status(start_time, 'Finished!')
    yield 'Finished!'

    # except:
    #     print(sys.exc_info()[0])
    #     yield sys.exc_info()[0]
    #     print(traceback.format_exc())
    #     yield traceback.format_exc()
    #
    # finally:
    #     print("Press Enter to close window")
    #     raw_input()

if __name__ == '__main__':
    main(munger_builder_id=1)
