const React = require('react')

function AggregateChooser(props) {
  return (
    <div className="aggregate-chooser-menu">
      {props.aggregateFieldTypes.map(fieldType =>
        <div
          key={fieldType.id}
          data-field-type={fieldType.id}
          className="aggregate-type-choice"
        >
          {props.getFieldTypeName(fieldType.id)}
        </div>
      )}
    </div>
  )
}

AggregateChooser.propTypes = {
  id: React.PropTypes.number.isRequired,
  aggregateFieldTypes: React.PropTypes.array.isRequired,
  getFieldTypeName: React.PropTypes.func.isRequired,
}

module.exports = AggregateChooser
