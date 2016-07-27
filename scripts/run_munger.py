import pandas as pd
import numpy as np
from collections import OrderedDict

from datetime import datetime
from glob import glob
import os
import sys
import traceback
from io import StringIO

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from django.conf import settings
from script_builder.models import MungerBuilder

def print_run_status(run_start_time,message):
    print('\n{0} - {1}'.format(datetime.now()-run_start_time, message))

def main(munger_builder_id=1):
    # try:
    run_start_time = datetime.now()
    formatted_date = run_start_time.strftime('%Y-%m-%d')

    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    # Read data from singups with orders CSV from Looker and load into pandas DataFrame
    # input_file = glob(os.path.abspath(mb.input_path))[0]
    input_file = os.path.join(settings.BASE_DIR, 'static', mb.input_path)
    print_run_status(run_start_time, 'Reading Data From:\n' + input_file.replace('\\', '/'))

    if mb.rows_to_delete_top and mb.rows_to_delete_top != 0:
        lines = open(input_file).readlines()
        lines_top_removed = lines[mb.rows_to_delete_top:]
        df = pd.read_csv(StringIO(''.join(lines_top_removed)))
    else:
        df = pd.read_csv(input_file)

    if mb.rows_to_delete_bottom and mb.rows_to_delete_bottom != 0:
        df = df.drop(df.index[-mb.rows_to_delete_bottom:])

    if mb.rename_field_dict:
        df = df.rename(columns=mb.rename_field_dict)

    yield df.to_html()

    #Create Pivot Table on Key and Write Output CSV
    print_run_status(run_start_time, 'Writing Output CSVs...')
    pivot_output = pd.pivot_table(
        df,
        index=mb.index_fields,
        columns=mb.column_fields,
        values=list(mb.aggregate_names_with_functions().keys()),
        aggfunc=mb.aggregate_names_with_functions(evaled=True),
        fill_value=0,
    )

    # rev = pivot_output[('revenue','sum','west')]
    # pivot_output = pivot_output.query("@rev > 100")
    # print(rev)
    # yield pivot_output.to_html()

    # pivot_output = pivot_output.query('sales_name == ["ian","melanie"]')
    # pivot_output = pivot_output.sort_index()

    # pivot_output = pivot_output.sort_values([
    #     ('revenue','mean','east'),
    # ], ascending=[1])

    # yield pivot_output.to_html()
    # pivot_output = pivot_output.reorder_levels([1, 0, 2], axis=1)

    print(pivot_output)
    yield pivot_output.to_html()


    munger_output_path = 'media/user_munger_output/{0}-output.csv'.format(mb.safe_file_name)
    pivot_output.to_csv(os.path.join(settings.BASE_DIR, munger_output_path))

    print_run_status(run_start_time, 'Finished!')
    yield 'Finished!'

    # except:
    #     print(sys.exc_info()[0])
    #     yield sys.exc_info()[0]
    #     print(traceback.format_exc())
    #     yield traceback.format_exc()

if __name__ == '__main__':
    main(munger_builder_id=1)
