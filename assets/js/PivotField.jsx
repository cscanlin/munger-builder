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

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      data_field: this.props.data_field,
      field_type: this.props.field_type,
    }
  }

  componentDidMount() {
    console.log('mount pivot field')
  }

  componentWillUnmount() {
    console.log('unmount pivot field')
  }

  render() {
    const fieldTypeName = this.props.fieldTypeName(this.state.field_type)
    const pivotFieldClass = `${fieldTypeName}-field list-group-item`
    return this.props.connectDragSource(
      <div className={pivotFieldClass}>
        <div className="field-text">
          <span className="aggregate-text">{fieldTypeName} of </span>
          <span className="name-text">{this.props.activeName(this.props.data_field)}</span>
        </div>
      </div>
    )
  }

}

PivotField.propTypes = {
  id: React.PropTypes.number.isRequired,
  data_field: React.PropTypes.number.isRequired,
  field_type: React.PropTypes.number.isRequired,
  deletePivotField: React.PropTypes.func.isRequired,
  fieldTypeName: React.PropTypes.func.isRequired,
  activeName: React.PropTypes.func.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired,
}
module.exports = DragSource('PivotField', pivotFieldSource, collect)(PivotField)
