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
    try:
        run_start_time = datetime.now()
        formatted_date = run_start_time.strftime('%Y-%m-%d')

        mb = MungerBuilder.objects.get(pk=munger_builder_id)

        # Read data from singups with orders CSV from Looker and load into pandas DataFrame
        input_file = glob(os.path.abspath(mb.input_path))[0]
        print_run_status(run_start_time, 'Reading Data From:\n' + input_file.replace('\\', '/'))

        if mb.rows_to_delete_top:
            lines = open(input_file).readlines()
            temp_file = 'media/user_munger_temp/{0}-temp_{1}.csv'.format(mb.munger_name, formatted_date)
            open(temp_file, 'w').writelines(lines[mb.rows_to_delete_top:])
        else:
            temp_file = input_file

        df = pd.read_csv(temp_file)

        if mb.rows_to_delete_bottom:
            df = df.drop(df.index[-mb.rows_to_delete_bottom:])

        yield df.to_html()

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

        pivot_output.to_csv('media/user_munger_output/{0}-output_{1}.csv'.format(mb.munger_name, formatted_date))

        print_run_status(run_start_time, 'Finished!')
        yield 'Finished!'

    except:
        print(sys.exc_info()[0])
        yield sys.exc_info()[0]
        print(traceback.format_exc())
        yield traceback.format_exc()

if __name__ == '__main__':
    main(munger_builder_id=1)
