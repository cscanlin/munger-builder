const React = require('react')
const AdditionalOptionsField = require('./AdditionalOptionsField')

function AdditionalOptions(props) {
  return (
    <form className="additional-options-container">
      <AdditionalOptionsField
        type="text"
        fieldName="input_path"
        fieldValue={props.input_path}
        updateMunger={props.updateMunger}
      />
      <AdditionalOptionsField
        type="text"
        fieldName="output_path"
        fieldValue={props.output_path}
        updateMunger={props.updateMunger}
      />
      <AdditionalOptionsField
        type="number"
        fieldName="rows_to_delete_top"
        fieldValue={props.rows_to_delete_top}
        updateMunger={props.updateMunger}
      />
      <AdditionalOptionsField
        type="number"
        fieldName="rows_to_delete_bottom"
        fieldValue={props.rows_to_delete_bottom}
        updateMunger={props.updateMunger}
      />
    </form>
  )
}

AdditionalOptions.propTypes = {
  default_aggregate_field_type: React.PropTypes.number,
  input_path: React.PropTypes.string,
  output_path: React.PropTypes.string,
  rows_to_delete_bottom: React.PropTypes.number,
  rows_to_delete_top: React.PropTypes.number,
  updateMunger: React.PropTypes.func.isRequired,
}

module.exports = AdditionalOptions
