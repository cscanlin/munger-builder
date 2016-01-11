
import pandas as pd
import numpy as np
from datetime import datetime
from glob import glob
import os
from progressbar import ProgressBar
import sys
import traceback

from python_vlookup import get_csv_data, create_column_dict, faster_vlookup

DOWNLOADS_FOLDER = os.path.expanduser("~") + '/Downloads/'

OUTPUT_FOLDER = None

if not OUTPUT_FOLDER:
    OUTPUT_FOLDER = DOWNLOADS_FOLDER

def print_status(message):
    print('\n{0} - {1}'.format(datetime.now()-start_time, message))

def date_as_excel_num(date):
    return (date - datetime(1899, 12, 30))

def do_lookup(df, column_lookup_dict, pbar):
    pbar.update(int(df.name))
    return faster_vlookup(
        df['register_source'],
        column_lookup_dict,
        debug='skip',
        error_value='Unpaid',
    )

# Old Key Concatenation
# def build_key(df, pbar):
#     pbar.update(int(df.name))
#     return '{0}{1}'.format(df['channel_name'], df['date_number'])
# df['Key'] = df.apply(build_key, args=(pbar,), axis=1)
# df['Key'] = df.apply(lambda x:'{0}{1}'.format(x['channel_name'],x['date_number']),axis=1)

if __name__ == '__main__':

    try:
        start_time = datetime.now()

        # Build column_lookup_dict from master_dash_lookup.csv
        print_status('Building Lookups...')
        csv_rows = get_csv_data('master_dash_lookup.csv')
        bad_column_lookup_dict = create_column_dict(csv_rows, 1)
        #!!!HACK!!! - lower case for lookup key so match works correctly
        column_lookup_dict = dict((k.lower(), v) for k,v in bad_column_lookup_dict.iteritems())

        # Read data from singups with orders CSV from Looker and load into pandas DataFrame
        data_file_name = glob(os.path.join(DOWNLOADS_FOLDER, 'signups with orders *.csv'))[0]
        print_status('Reading Data From:\n' + data_file_name.replace('\\', '/'))

        with open(data_file_name, 'r') as f:
            num_lines = sum(1 for line in f)
        pbar = ProgressBar(maxval=num_lines)

        df = pd.read_csv(data_file_name)

        #Rename Looker data field names so they match Master Dash column names
        df = df.rename(
            columns={
                'Bi Users Registration Source Medium': 'register_source',
                'Bi Users Created Date': 'signupDate',
                'Bi Orders Completed Date': 'order_date',
                'Bi Users Count': 'numSignups',
                'Bi Orders Count': 'numOrders',
                'Bi Line Items Sum Gross Booked Sales Revenue': 'SalesRevenue',
                'Bi Line Items Sum Gross Booked Retail Revenue': 'RetailRevenue',
                'Bi Users Count Unsubscribe': 'Unsubscribed',
                'Bi Users Count Bounced': 'Bounced',
                'Bi Users Count Booked Customers': 'Customers',
                'Bi Users Count 30 Day Customers': 'CustomersWithin30Days',
            }
        )

        # Switch date strings to datetime fields
        df['order_date'],df['signupDate'] = pd.to_datetime(df['order_date']), pd.to_datetime(df['signupDate'])

        df['Revenue'] = df['SalesRevenue'] + df['RetailRevenue']

        # Lookup register_source in from column_lookup_dict
        print_status('Looking Up Channels...')
        pbar.start()
        df['channel_name'] = df.apply(do_lookup, args=(column_lookup_dict, pbar), axis=1)
        pbar.finish()

        # Change signupDate format to excel date_number
        print_status('Parsing Dates...')
        df['date_number'] = date_as_excel_num(df['signupDate']).astype('timedelta64[D]')

        # Concatenate looked-up channel_name and date_number for Key
        print_status('Making Master Key...')
        pbar.start()
        df['Key'] = df['channel_name'] + df['date_number'].astype(int).astype(str)
        pbar.finish()

        # Calculate Revenue if order month/year same as signup month/year
        print_status('Calculating m0_revenue...')
        df['m0_revenue'] = np.where(
            np.logical_and(
                df['order_date'].dt.year == df['signupDate'].dt.year,
                df['order_date'].dt.month == df['signupDate'].dt.month
            ),
            df['Revenue'],
            0,
        )

        #TODO - write comment
        print_status('Building Revenue Buckets...')
        progress = ProgressBar()
        df['order_latency_days'] = (df['order_date'] - df['signupDate']).astype('timedelta64[D]').fillna(-1)
        for bucket in progress([1, 7, 30, 60, 90, 120, 150, 180, 365]):
            column_heading = '{0}DayRevenue'.format(bucket)
            df[column_heading] = np.where(
                df['order_latency_days']<=bucket,
                df['Revenue'],
                0,
            )

        #Drop extra columns
        df = df.drop('signupDate', 1)
        df = df.drop('order_latency_days', 1)
        df = df.drop('channel_name', 1)
        df = df.drop('date_number', 1)

        #Bring Key to Front - I don't really know how this works
        cols = list(df)
        cols.insert(0, cols.pop(cols.index('Key')))
        df = df.ix[:, cols]

        #Create Pivot Table on Key and Write Output CSV
        print_status('Writing Output CSVs...')
        signup_pivot = pd.pivot_table(df, index=['Key'], aggfunc=[np.sum])
        signup_pivot.to_csv(os.path.join(OUTPUT_FOLDER, 'signup_pivot.csv'))

        #Create Pivot Table on order_date and Write Output CSV
        order_pivot = pd.pivot_table(
            df,
            index=['order_date'],
            values=['Revenue', 'RetailRevenue', 'SalesRevenue', 'numOrders'],
            aggfunc=[np.sum],
        )
        order_pivot.to_csv(os.path.join(OUTPUT_FOLDER, 'order_pivot.csv'))

        print_status('Finished!')

    except:
        print(sys.exc_info()[0])
        print(traceback.format_exc())

    finally:
        print("Press Enter to close window")
        input()
