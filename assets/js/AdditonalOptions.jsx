const React = require('react')

function AdditonalOptions(props) {
  const updateMunger = props.updateMunger
  return (
    React.createElement('form', { className: 'additional-options-container' },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Input Path',
        value: props.input_path,
        onChange: (e) => updateMunger({ input_path: e.target.value }, e),
        onBlur: (e) => updateMunger({ input_path: e.target.value }, e),
      }),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Output Path',
        value: props.output_path,
        onChange: (e) => updateMunger({ output_path: e.target.value }, e),
        onBlur: (e) => updateMunger({ output_path: e.target.value }, e),
      }),
      React.createElement('input', {
        type: 'number',
        placeholder: 'Rows to Delete Top',
        value: props.rows_to_delete_top,
        onChange: (e) => updateMunger({ rows_to_delete_top: parseInt(e.target.value) }, e),
        onBlur: (e) => updateMunger({ rows_to_delete_top: parseInt(e.target.value) }, e),
      }),
      React.createElement('input', {
        type: 'number',
        placeholder: 'Rows to Delete Bottom',
        value: props.rows_to_delete_bottom,
        onChange: (e) => updateMunger({ rows_to_delete_bottom: parseInt(e.target.value) }, e),
        onBlur: (e) => updateMunger({ rows_to_delete_bottom: parseInt(e.target.value) }, e),
      })
    )
  )
}
AdditonalOptions.propTypes = {
  default_aggregate_field_type: React.PropTypes.number,
  input_path: React.PropTypes.string,
  output_path: React.PropTypes.string,
  rows_to_delete_bottom: React.PropTypes.number,
  rows_to_delete_top: React.PropTypes.number,
  updateMunger: React.PropTypes.func.isRequired,
}

module.exports = AdditonalOptions
