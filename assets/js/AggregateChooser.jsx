const React = require('react')

function AggregateChooser(props) {
  return (
    <div className="aggregate-chooser-menu" style={props.chooserStyle}>
      {props.aggregateFieldTypes().map(fieldType =>
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
  aggregateFieldTypes: React.PropTypes.func.isRequired,
  getFieldTypeName: React.PropTypes.func.isRequired,
  chooserStyle: React.PropTypes.object,
}

module.exports = AggregateChooser
