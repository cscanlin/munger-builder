const React = require('react')

class AggregateChooser extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(e) {
    const fieldTypeID = e.target.getAttribute('data-field-type')
    this.props.updatePivotField(this.props.id, fieldTypeID)
  }

  render() {
    return (
      <div className="aggregate-chooser-menu">
        {this.props.aggregateFieldTypes.map(fieldType =>
          <div key={fieldType.id} data-field-type={fieldType.id} onClick={this.onClick}>
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
