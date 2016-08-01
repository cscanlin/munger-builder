const React = require('react')
const DragSource = require('react-dnd').DragSource

const pivotFieldSource = {
  beginDrag(props) {
    console.log('begin pivot field drag')
    return { pivotField: props.id }
  },
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class PivotField extends React.Component {

  componentDidMount() {
    console.log('mount pivot field')
  }

  componentWillUnmount() {
    console.log('unmount pivot field')
  }

  render() {
    const pivotFieldClass = `${this.props.fieldTypeName}-field list-group-item`
    return this.props.connectDragSource(
      <div className={pivotFieldClass}>
        <div className="field-text">
          <span className="aggregate-text">{this.props.fieldTypeName} of </span>
          <span className="name-text">{this.props.active_name}</span>
        </div>
      </div>
    )
  }

}

PivotField.propTypes = {
  id: React.PropTypes.number.isRequired,
  data_field: React.PropTypes.number.isRequired,
  field_type: React.PropTypes.number.isRequired,
  active_name: React.PropTypes.string.isRequired,
  deletePivotField: React.PropTypes.func.isRequired,
  fieldTypeName: React.PropTypes.string.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired,
}
module.exports = DragSource('PivotField', pivotFieldSource, collect)(PivotField)
