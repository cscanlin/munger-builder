const React = require('react')
const HTML5Backend = require('react-dnd-html5-backend')
const DragDropContext = require('react-dnd').DragDropContext

const DataField = require('./DataField')
const FieldBank = require('./FieldBank')
const MainTable = require('./MainTable')
const PivotField = require('./PivotField')
const ScriptBuilder = require('./ScriptBuilder')
const AdditionalOptions = require('./AdditionalOptions')
const DeleteZone = require('./DeleteZone')
const Api = require('./Api')
const Logger = require('./Logger')

class PivotApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data_fields: [],
      pivot_fields: [],
      field_types: [],
      default_aggregate_field_type: null,
      input_path: '',
      munger_name: '',
      output_path: '',
      rows_to_delete_bottom: 0,
      rows_to_delete_top: 0,
      is_sample: false,
      showOriginalNames: false,
    }
    this.getFieldTypeName = this.getFieldTypeName.bind(this)
    this.getNewName = this.getNewName.bind(this)
    this.handleNewNameChange = this.handleNewNameChange.bind(this)
    this.handleOriginalNameChange = this.handleOriginalNameChange.bind(this)
    this.removeRelatedPivotFields = this.removeRelatedPivotFields.bind(this)
    this.aggregateFieldTypes = this.aggregateFieldTypes.bind(this)
    this.toggleOriginalNames = this.toggleOriginalNames.bind(this)

    this.loadInitial = Api.loadInitial.bind(this)
    this.updateMunger = Api.updateMunger.bind(this)

    this.addDataField = Api.addDataField.bind(this)
    this.updateDataField = Api.updateDataField.bind(this)
    this.deleteDataField = Api.deleteDataField.bind(this)

    this.addPivotField = Api.addPivotField.bind(this)
    this.updatePivotField = Api.updatePivotField.bind(this)
    this.deletePivotField = Api.deletePivotField.bind(this)
  }

  componentDidMount() {
    this.loadInitial()
  }

  getFieldTypeName(fieldTypeId, returnFunctionName = false) {
    const fieldTypeMap = {}
    this.state.field_types.map((fieldType) => {
      if (returnFunctionName) {
        fieldTypeMap[fieldType.id] = fieldType.type_function
      } else {
        fieldTypeMap[fieldType.id] = fieldType.type_name
      }
      return fieldTypeMap
    })
    return fieldTypeMap[fieldTypeId]
  }

  getNewName(dataFieldId) {
    const newNameMap = {}
    this.state.data_fields.map((dataField) => {
      newNameMap[dataField.id] = dataField.new_name || dataField.current_name
      return newNameMap
    })
    return newNameMap[dataFieldId]
  }

  aggregateFieldTypes() { return this.state.field_types.filter(fieldType => fieldType.id > 2) }

  toggleOriginalNames() {
    const showHide = !this.state.showOriginalNames
    this.setState({ showOriginalNames: showHide })
  }

  handleNewNameChange(dataFieldId, newName) {
    Logger.log('change new_name')
    this.state.data_fields.map((dataField) => {
      if (dataField.id === dataFieldId) {
        dataField.new_name = newName
      }
      return dataField
    })
    this.setState({ data_fields: this.state.data_fields })
  }

  handleOriginalNameChange(dataFieldId, newOriginalName) {
    Logger.log('change original')
    this.state.data_fields.map((dataField) => {
      if (dataField.id === dataFieldId) {
        dataField.current_name = newOriginalName
      }
      return dataField
    })
    this.setState({ data_fields: this.state.data_fields })
  }

  removeRelatedPivotFields(dataFieldId) {
    const pivotFieldsToDelete = this.state.pivot_fields.filter(pivotField =>
      pivotField.data_field === dataFieldId
    )
    pivotFieldsToDelete.forEach(pivotField => this.deletePivotField(pivotField.id))
  }

  render() {
    return (
      <DeleteZone className="pivot-app" deletePivotField={this.deletePivotField}>
        <h3>
          <input
            type="text"
            value={this.state.munger_name}
            className="munger-name-input"
            onChange={e => this.setState({ munger_name: e.target.value })}
            onBlur={e => this.updateMunger({ munger_name: this.state.munger_name }, e)}
          />
        </h3>
        <FieldBank {...this} {...this.state}>
          {this.state.data_fields.map(dataField =>
            <DataField key={dataField.id} {...this} {...this.state} {...dataField} />
          )}
        </FieldBank>
        <MainTable {...this} {...this.state} >
          {this.state.pivot_fields.map(pivotField =>
            <PivotField key={pivotField.id} {...this} {...pivotField} />
          )}
        </MainTable>
        <ScriptBuilder {...this} {...this.state} />
        <AdditionalOptions {...this} {...this.state} />
      </DeleteZone>
    )
  }
}


PivotApp.propTypes = {
  mungerId: React.PropTypes.number.isRequired,
}
module.exports = DragDropContext(HTML5Backend)(PivotApp)
