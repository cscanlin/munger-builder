const React = require('react');

class ScriptBuilder extends React.Component {

  constructor(props) {
    super(props);
    this.indexFields = this.indexFields.bind(this);
  }

  indexFields() {
    return this.props.pivot_fields.filter(
      pivotField => pivotField.field_type === 1
    ).join(', ');
  }

  columnFields() {
    return this.props.pivot_fields.filter(pivotField => pivotField.field_type === 2);
  }

  aggregateNamesWithFunctions() {
    return 'TODO aggregates';
    // # Needs to be ordered dicts
    // func = eval if evaled else str
    // aggregates_dict = defaultdict(list)
    // for pf in this.props.pivot_fields:
    // aggregates_dict[pf.active_name].append(pf.type_function)
    // return {name: func(', '.join(type_functions)) for name, type_functions in aggregates_dict.items()}
  }

  renameFieldMap() {
    const renameFieldMap = {};
    this.state.data_fields.map(dataField => {
      renameFieldMap[dataField.current_name] = dataField.new_name;
      return renameFieldMap;
    });
    return renameFieldMap;
  }

  safeFileName() {
    return this.props.munger_name.replace(' ', '_').toLowerCase();
  }

  fullOutputPath() {
    return 'TODO output';
    // if (!this.props.output_path) {
    //   input_dir = os.path.dirname(this.props.input_path)
    //   return os.path.join(input_dir, '{0}-output.csv'.format(this.props.safe_file_name))
    // }
  }

  render() {
    return (
      <pre>{this.indexFields()}</pre>
    );
  }
}

ScriptBuilder.propTypes = {
  data_fields: React.PropTypes.array,
  pivot_fields: React.PropTypes.array,
  field_types: React.PropTypes.array,
  input_path: React.PropTypes.string,
  munger_name: React.PropTypes.string.isRequired,
  output_path: React.PropTypes.string,
  rows_to_delete_bottom: React.PropTypes.number,
  rows_to_delete_top: React.PropTypes.number,
};
module.exports = ScriptBuilder;

// import pandas as pd
// import numpy as np
//
// import os
// from datetime import datetime
//
// def print_run_status(run_start_time,message):
//     print('\n{0} - {1}'.format(datetime.now()-run_start_time, message))
//
// {% if mb.input_path %}
// input_file = os.path.abspath(r'{{ mb.input_path }}')
// {% else %}
// input_file = 'ADD INPUT FILE PATH HERE'
// {% endif %}
//
// print_run_status(run_start_time, 'Reading Data From:\n{0}'.format(input_file))
// {% if mb.rows_to_delete_top and mb.rows_to_delete_top != 0 %}
// df = pd.read_csv(input_file, skiprows=mb.rows_to_delete_top)
// {% else %}
// df = pd.read_csv(input_file)
// {% endif %}
//
// {% if mb.rows_to_delete_bottom and mb.rows_to_delete_bottom != 0 %}
// df = df.drop(df.index[-{{ mb.rows_to_delete_bottom }}:])
// {% endif %}
//
// {% if mb.rename_field_dict %}
// print_run_status(run_start_time, 'Renaming Fields...')
// df = df.rename(columns={{ mb.rename_field_dict }})
// {% endif %}
//
// print_run_status(run_start_time, 'Building Pivot Table...')
// pivot_output = pd.pivot_table(
//     df,
//     index={{ mb.index_fields }},
//     columns={{ mb.column_fields }},
//     values=[{% for key in mb.aggregate_names_with_functions().keys() %}'{{ key }}',{% endfor %}],
//     aggfunc={
//       {% for key, value in mb.aggregate_names_with_functions().items() %}
//         '{{ key }}': [{{ value }}],
//       {% endfor %}
//     },
//     fill_value=0,
// )
// print(pivot_output)
//
// print_run_status(run_start_time, 'Writing Output CSVs...')
// pivot_output.to_csv(os.path.abspath(r'{{ mb.get_output_path }}'))
//
// print_run_status(run_start_time, 'Finished!')
