const React = require('react')
const DropTarget = require('react-dnd').DropTarget

const zoneTypeIdMap = {
  index: 1,
  column: 2,
  aggregate: null,
}

const zoneTarget = {
  drop(props, monitor) {
    console.log('drop')
    const dataFieldId = monitor.getItem().dataField
    props.addPivotField(dataFieldId, zoneTypeIdMap[props.zoneType])
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
    return this.props.connectDropTarget(
      <div id={idClass} className={`dropzone ${idClass}`}>
        <span className="zone-heading">{`${this.props.zoneType} fields`}</span>
        {this.props.children}
      </div>
    )
  }
}

DropZone.propTypes = {
  zoneType: React.PropTypes.string.isRequired,
  addPivotField: React.PropTypes.func.isRequired,
  children: React.PropTypes.node,
  isOver: React.PropTypes.bool.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
}

module.exports = DropTarget('DataField', zoneTarget, collect)(DropZone)
