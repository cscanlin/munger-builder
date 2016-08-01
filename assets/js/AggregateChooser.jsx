const React = require('react')

class AggregateChooser extends React.Component {
  render() {
    return (
      <div className="aggregate-chooser-menu">
        {this.props.aggregateFieldTypes.map(fieldType =>
          <div
            key={fieldType.id}
            data-field-type={fieldType.id}
            className="aggregate-type-choice"
          >
            {this.props.getFieldTypeName(fieldType.id)}
          </div>
        )}
      </div>
    )
  }
}

AggregateChooser.propTypes = {
  id: React.PropTypes.number.isRequired,
  aggregateFieldTypes: React.PropTypes.array.isRequired,
  getFieldTypeName: React.PropTypes.func.isRequired,
  updatePivotField: React.PropTypes.func.isRequired,
}

module.exports = AggregateChooser
