const React = require('react')
const DropTarget = require('react-dnd').DropTarget

const deleteTarget = {
  drop(props, monitor) {
    if (!monitor.didDrop()) {
      console.log('delete-pivot')
      props.deletePivotField(monitor.getItem().pivotField)
    }
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    // isOver: monitor.isOver(),
    // canDrop: monitor.canDrop(),
  }
}

function DeleteZone(props) {
  // const deleteZoneStyle = { backgroundColor: props.canDrop ? '#FCC' : 'inherit' }
  return props.connectDropTarget(<div>{props.children}</div>)
}

DeleteZone.propTypes = {
  children: React.PropTypes.node,
  connectDropTarget: React.PropTypes.func.isRequired,
  deletePivotField: React.PropTypes.func.isRequired,
  // isOver: React.PropTypes.bool.isRequired,
  // canDrop: React.PropTypes.bool.isRequired,
}

module.exports = DropTarget('PivotField', deleteTarget, collect)(DeleteZone)
