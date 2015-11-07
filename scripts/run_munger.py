import pandas as pd
import numpy as np

from datetime import datetime
from glob import glob
import os
import sys
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from script_builder.models import MungerBuilder

def print_run_status(run_start_time,message):
    print('\n{0} - {1}'.format(datetime.now()-run_start_time, message))

def main(munger_builder_id=1):
    # try:
    run_start_time = datetime.now()

    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    # Read data from singups with orders CSV from Looker and load into pandas DataFrame
    input_file = glob(os.path.abspath(mb.input_path))[0]
    print_run_status(run_start_time, 'Reading Data From:\n' + input_file.replace('\\', '/'))

    df = pd.read_csv(input_file)

    #Create Pivot Table on Key and Write Output CSV
    print_run_status(run_start_time, 'Writing Output CSVs...')
    pivot_output = pd.pivot_table(
        df,
        index=mb.index_fields(),
        values=mb.agg_fields().keys(),
        aggfunc=mb.agg_fields(),
    )
    # if mb.fields_to_rename():
    #     pivot_output = pivot_output.rename(columns=mb.fields_to_rename())

    print(pivot_output)
    yield pivot_output.to_html()

    formatted_date = datetime.now().strftime('%Y-%m-%d')
    pivot_output.to_csv('media/user_munger_output/{0}-output_{1}.csv'.format(mb.munger_name, formatted_date))

    print_run_status(run_start_time, 'Finished!')
    yield 'Finished!'

    # except:
    #     print(sys.exc_info()[0])
    #     yield sys.exc_info()[0]
    #     print(traceback.format_exc())
    #     yield traceback.format_exc()

if __name__ == '__main__':
    main(munger_builder_id=1)
