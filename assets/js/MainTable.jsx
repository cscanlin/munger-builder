const React = require('react')
const DropZone = require('./DropZone')

class MainTable extends React.Component {

  render() {
    return (
      <div id="main-dropzone-container" className="main-dropzone-container clear">
        <div id="left-dropzone-container" className="left-dropzone-container">
          <DropZone addPivotField={this.props.addPivotField} zoneType="index">
            {this.props.children.filter(pivotField =>
              pivotField.props.field_type === 1
            )}
          </DropZone>
        </div>
        <div id="right-dropzone-container" className="right-dropzone-container">
          <DropZone addPivotField={this.props.addPivotField} zoneType="column">
            {this.props.children.filter(pivotField =>
              pivotField.props.field_type === 2
            )}
          </DropZone>
          <DropZone addPivotField={this.props.addPivotField} zoneType="aggregate">
            {this.props.children.filter(pivotField =>
              pivotField.props.field_type > 2
            )}
          </DropZone>
        </div>
      </div>
    )
  }
}

MainTable.propTypes = {
  addPivotField: React.PropTypes.func.isRequired,
  children: React.PropTypes.node,
}

module.exports = MainTable
