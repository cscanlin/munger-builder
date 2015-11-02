from __future__ import absolute_import
import sys
import StringIO
import contextlib

from celery import task, shared_task
from task_scheduler.celery import app
from celery.utils.log import get_task_logger

import scripts.munger

logger = get_task_logger(__name__)

@shared_task
def munger_builder(munger_builder_id=1):
    return [log_entry for log_entry in scripts.munger.main(munger_builder_id)]
