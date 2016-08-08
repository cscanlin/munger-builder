import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from script_builder.models import MungerBuilder

from jinja2 import Template, Environment, PackageLoader

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
