const React = require('react')
const DropTarget = require('react-dnd').DropTarget

const Logger = require('./Logger')

const zoneTarget = {
  drop(props, monitor) {
    const dropItem = monitor.getItem()
    Logger.log('drop', monitor.getItem())
    if ('dataField' in dropItem) {
      props.addPivotField(dropItem.dataField, props.fieldType)
    } else if ('pivotField' in dropItem) {
      const fieldType = (props.fieldType === 3 && dropItem.fieldType >= 3
        ? dropItem.fieldType
        : props.fieldType
      )
      props.updatePivotField(dropItem.pivotField, fieldType)
    }
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    dataField: monitor.getItem(),
  }
}

class DropZone extends React.Component {
  render() {
    const idClass = `${this.props.zoneType}-dropzone`
    const zoneStyle = {
      opacity: this.props.isOver ? 0.9 : 1,
    }
    return this.props.connectDropTarget(
      <div id={idClass} className={`dropzone ${idClass}`} style={zoneStyle}>
        <span className="zone-heading">{`${this.props.zoneType} fields`}</span>
        {this.props.children}
      </div>
    )
  }
}

DropZone.propTypes = {
  zoneType: React.PropTypes.string.isRequired,
  fieldType: React.PropTypes.number,
  addPivotField: React.PropTypes.func.isRequired,
  updatePivotField: React.PropTypes.func.isRequired,
  children: React.PropTypes.node,
  isOver: React.PropTypes.bool.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
}

module.exports = DropTarget(['DataField', 'PivotField'], zoneTarget, collect)(DropZone)
