from __future__ import absolute_import
import sys
import StringIO
import contextlib

from celery import task, shared_task
from task_scheduler.celery import app
from celery.utils.log import get_task_logger

import scripts.run_munger
import scripts.build_munger

logger = get_task_logger(__name__)

@shared_task
def run_munger(munger_builder_id=1):
    return [log_entry for log_entry in scripts.run_munger.main(munger_builder_id)]

@shared_task
def build_munger(munger_builder_id=1):
    return scripts.build_munger.main(munger_builder_id)
