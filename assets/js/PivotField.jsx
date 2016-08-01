const React = require('react')
const DragSource = require('react-dnd').DragSource

const Button = require('./Button')

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

  toggleChooser() {
    return
  }

  render() {
    const pivotFieldClass = `${this.props.fieldTypeName}-field list-group-item`
    const fullFieldText = `${this.props.fieldTypeName} of ${this.props.active_name}`
    const fieldTextStyle = {
      fontSize: 18.5 - fullFieldText.length / 4,
    }
    console.log(fullFieldText.length)
    return this.props.connectDragSource(
      <div className={pivotFieldClass} style={fieldTextStyle}>
        <div className="field-text">
          {fullFieldText}
        </div>
        <Button
          type="image"
          src="/static/hamburger.png"
          value="toggle"
          className="small-image-button right aggregate-chooser-toggle"
          onClick={this.toggleChooser}
        />
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
