const React = require('react')

class AdditonalOptions extends React.Component {
  render() {
    return (
      React.createElement('form', { className: 'additional-options-container' },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Input Path',
          value: this.props.input_path,
          onChange: (e) => this.props.updateMunger({ input_path: e.target.value }, e),
          onBlur: (e) => this.props.updateMunger({ input_path: e.target.value }, e),
        }),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Rows to Delete Top',
          value: this.props.output_path,
          onChange: (e) => this.props.updateMunger({ output_path: e.target.value }, e),
          onBlur: (e) => this.props.updateMunger({ output_path: e.target.value }, e),
        }),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Rows to Delete Bottom',
          value: this.props.rows_to_delete_top,
          onChange: (e) => this.props.updateMunger({ rows_to_delete_top: e.target.value }, e),
          onBlur: (e) => this.props.updateMunger({ rows_to_delete_top: e.target.value }, e),
        }),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Output Path',
          value: this.props.rows_to_delete_bottom,
          onChange: (e) => this.props.updateMunger({ rows_to_delete_bottom: e.target.value }, e),
          onBlur: (e) => this.props.updateMunger({ rows_to_delete_bottom: e.target.value }, e),
        })
      )
    )
  }
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
