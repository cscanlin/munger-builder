const React = require('react')

class AggregateChooser extends React.Component {
  onClick() {
    return
  }

  render() {
    return (
      <div className="aggregate-chooser-menu">
        {this.props.aggregateFieldTypes.map(fieldType =>
          <div key={fieldType.id} onClick={this.onClick}>
            {this.props.getFieldTypeName(fieldType.id)}
          </div>
        )}
      </div>
    )
  }
}

AggregateChooser.propTypes = {
  aggregateFieldTypes: React.PropTypes.array.isRequired,
  getFieldTypeName: React.PropTypes.func.isRequired,
}

module.exports = AggregateChooser
