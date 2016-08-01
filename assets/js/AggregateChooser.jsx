const React = require('react')

class AggregateChooser extends React.Component {
  render() {
    return (
      <div className="aggregate-chooser-menu">
        {this.props.aggregateFieldTypes.map(dataField =>
          <div key={dataField} style={{ color: 'black' }}>{dataField}</div>
        )}
      </div>
    )
  }
}

AggregateChooser.propTypes = {
  aggregateFieldTypes: React.PropTypes.array.isRequired,
}

module.exports = AggregateChooser
