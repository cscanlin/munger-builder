const React = require('react')
const Button = require('./Button')
const AdditionalOptionsField = require('./AdditionalOptionsField')
const AggregateChooser = require('./AggregateChooser')

class AdditionalOptions extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showAggregateChooser: false,
    }
    this.showAggregateChooser = this.showAggregateChooser.bind(this)
    this.hideAggregateChooser = this.hideAggregateChooser.bind(this)
  }

  showAggregateChooser() {
    console.log('show agg chooser')
    document.body.addEventListener('click', this.hideAggregateChooser)
    this.setState({ showAggregateChooser: true })
  }

  hideAggregateChooser(e) {
    if (e.target.hasAttribute('data-field-type')) {
      console.log('agg selected')
      const fieldTypeID = e.target.getAttribute('data-field-type')
      console.log(fieldTypeID)
      // this.props.updatePivotField(this.props.id, fieldTypeID)
    }
    document.body.removeEventListener('click', this.hideAggregateChooser)
    this.setState({ showAggregateChooser: false })
  }

  render() {
    return (
      <form className="additional-options-container">
        <Button
          type="button"
          value="╲╱"
          className="btn btn-primary default-aggregate-dropdown"
          onClick={this.showAggregateChooser}
        />
        <div className="default-aggregate-container">
          {this.state.showAggregateChooser ? <AggregateChooser {...this.props} /> : null}
        </div>
        <AdditionalOptionsField
          type="text"
          fieldName="input_path"
          fieldValue={this.props.input_path}
          updateMunger={this.props.updateMunger}
        />
        <AdditionalOptionsField
          type="text"
          fieldName="output_path"
          fieldValue={this.props.output_path}
          updateMunger={this.props.updateMunger}
        />
        <AdditionalOptionsField
          type="number"
          fieldName="rows_to_delete_top"
          fieldValue={this.props.rows_to_delete_top}
          updateMunger={this.props.updateMunger}
        />
        <AdditionalOptionsField
          type="number"
          fieldName="rows_to_delete_bottom"
          fieldValue={this.props.rows_to_delete_bottom}
          updateMunger={this.props.updateMunger}
        />
      </form>
    )
  }
}

AdditionalOptions.propTypes = {
  default_aggregate_field_type: React.PropTypes.number,
  input_path: React.PropTypes.string,
  output_path: React.PropTypes.string,
  rows_to_delete_bottom: React.PropTypes.number,
  rows_to_delete_top: React.PropTypes.number,
  updateMunger: React.PropTypes.func.isRequired,
  aggregateFieldTypes: React.PropTypes.func.isRequired,
  getFieldTypeName: React.PropTypes.func.isRequired,
}

module.exports = AdditionalOptions
