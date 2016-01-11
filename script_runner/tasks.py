
import sys
import io
import contextlib

from celery import task, shared_task
# from script_runner.celery import app
from celery.utils.log import get_task_logger
from django.conf import settings

import scripts.run_munger
import scripts.build_munger

logger = get_task_logger(__name__)

@shared_task
def run_munger(munger_builder_id=1):
    return [log_entry for log_entry in scripts.run_munger.main(munger_builder_id)]

@shared_task
def download_munger_async(munger_builder_id=1):
    mb = MungerBuilder.objects.get(pk=munger_builder_id)
    script_string = scripts.build_munger.main(munger_builder_id)
    file_path = os.path.join(settings.MEDIA_ROOT, 'user_munger_scripts', '{0}.py'.format(mb.munger_name))

    with open(file_path, 'r') as mf:
        response = HttpResponse(mf, content_type='application/octet-stream')
        response['Content-Disposition'] = 'filename={0}.py'.format(mb.munger_name)
        print(response)
        return response
