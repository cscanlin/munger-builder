const React = require('react')
const DropZone = require('./DropZone')

class MainTable extends React.Component {

  zoneTypeId(zoneType) {
    const zoneTypeIdMap = {
      index: 1,
      column: 2,
      aggregate: this.props.default_aggregate_field_type,
    }
    return zoneTypeIdMap[zoneType]
  }

  render() {
    return (
      <div id="main-dropzone-container" className="main-dropzone-container clear">
        <div id="left-dropzone-container" className="left-dropzone-container">
          <DropZone
            addPivotField={this.props.addPivotField}
            updatePivotField={this.props.updatePivotField}
            zoneType="index"
            fieldType={this.zoneTypeId('index')}
          >
            {this.props.children.filter(pivotField =>
              pivotField.props.field_type === 1
            )}
          </DropZone>
        </div>
        <div id="right-dropzone-container" className="right-dropzone-container">
          <DropZone
            addPivotField={this.props.addPivotField}
            updatePivotField={this.props.updatePivotField}
            zoneType="column"
            fieldType={this.zoneTypeId('column')}
          >
            {this.props.children.filter(pivotField =>
              pivotField.props.field_type === 2
            )}
          </DropZone>
          <DropZone
            addPivotField={this.props.addPivotField}
            updatePivotField={this.props.updatePivotField}
            zoneType="aggregate"
            fieldType={this.zoneTypeId('aggregate')}
          >
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
  updatePivotField: React.PropTypes.func.isRequired,
  default_aggregate_field_type: React.PropTypes.number,
  children: React.PropTypes.node,
}

module.exports = MainTable
