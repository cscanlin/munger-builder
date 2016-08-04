const React = require('react')
const $ = require('jquery')
const Cookie = require('js-cookie')
const update = require('react-addons-update')
const HTML5Backend = require('react-dnd-html5-backend')
const DragDropContext = require('react-dnd').DragDropContext

const DataField = require('./DataField')
const FieldBank = require('./FieldBank')
const MainTable = require('./MainTable')
const PivotField = require('./PivotField')
const ScriptBuilder = require('./ScriptBuilder')
const AdditionalOptions = require('./AdditionalOptions')
const DeleteZone = require('./DeleteZone')
// const Api = require('./Api')

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
    this.csrfHeader = new Headers({
      'x-csrftoken': Cookie.get('csrftoken'),
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
    this.newFieldName = this.newFieldName.bind(this)
    this.getFieldTypeName = this.getFieldTypeName.bind(this)
    this.getNewName = this.getNewName.bind(this)
    this.handleNewNameChange = this.handleNewNameChange.bind(this)
    this.handleOriginalNameChange = this.handleOriginalNameChange.bind(this)
    this.removeRelatedPivotFields = this.removeRelatedPivotFields.bind(this)
    this.aggregateFieldTypes = this.aggregateFieldTypes.bind(this)
    this.toggleOriginalNames = this.toggleOriginalNames.bind(this)

    this.updateMunger = this.updateMunger.bind(this)

    this.addDataField = this.addDataField.bind(this)
    this.updateDataField = this.updateDataField.bind(this)
    this.deleteDataField = this.deleteDataField.bind(this)

    this.addPivotField = this.addPivotField.bind(this)
    this.updatePivotField = this.updatePivotField.bind(this)
    this.deletePivotField = this.deletePivotField.bind(this)
  }

  componentDidMount() {
    const source = `/script_builder/mungers/${this.props.mungerId}?format=json`
    this.serverRequest = $.get(source, result => this.onMount(result))
  }

  componentWillUnmount() {
    this.serverRequest.abort()
  }

  onMount(result) {
    this.setState({ ...result })
  }

  getFieldTypeName(fieldTypeId, returnFunctionName = false) {
    const fieldTypeMap = {}
    this.state.field_types.map(fieldType => {
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
    this.state.data_fields.map(dataField => {
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
    console.log('change new_name')
    this.state.data_fields.map(dataField => {
      if (dataField.id === dataFieldId) {
        dataField.new_name = newName
      }
      return dataField
    })
    this.setState({ data_fields: this.state.data_fields })
  }

  handleOriginalNameChange(dataFieldId, newOriginalName) {
    console.log('change original')
    this.state.data_fields.map(dataField => {
      if (dataField.id === dataFieldId) {
        dataField.current_name = newOriginalName
      }
      return dataField
    })
    this.setState({ data_fields: this.state.data_fields })
  }

  newFieldName() {
    let numNewFields = this.state.data_fields.filter(item =>
      item.new_name.startsWith('New Field')
    ).length
    if (numNewFields > 0) {
      numNewFields += 1
      return `New Field ${numNewFields}`
    }
    return 'New Field'
  }

  async updateMunger(data, e) {
    if (e) {
      this.setState({ ...data })
      if (e.type === 'blur' || e.type === 'save') {
        const response = await fetch(`/script_builder/mungers/${this.props.mungerId}`, {
          credentials: 'same-origin',
          method: 'PUT',
          headers: this.csrfHeader,
          body: JSON.stringify({ ...data }),
        })
      }
    }
  }

  async addDataField() {
    console.log('add data field')
    const newDataField = {
      munger_builder: this.props.mungerId,
      current_name: this.newFieldName(),
    }
    const response = await fetch('/script_builder/data_fields/', {
      credentials: 'same-origin',
      method: 'POST',
      headers: this.csrfHeader,
      body: JSON.stringify({ ...newDataField }),
    })
    const data = await response.json();
    this.setState({ data_fields: this.state.data_fields.concat([data]) })
  }

  async addPivotField(dataFieldId, fieldTypeId) {
    console.log('add pivot field')
    const newPivotField = {
      data_field: dataFieldId,
      field_type: fieldTypeId || this.state.default_aggregate_field_type,
    }
    const response = await fetch('/script_builder/pivot_fields/', {
      credentials: 'same-origin',
      method: 'POST',
      headers: this.csrfHeader,
      body: JSON.stringify({ ...newPivotField }),
    })
    const data = await response.json();
    this.setState({ pivot_fields: this.state.pivot_fields.concat([data]) })
  }

  async updateDataField(dataFieldId, data) {
    console.log('update pivot field')
    const response = await fetch(`/script_builder/data_fields/${dataFieldId}`, {
      credentials: 'same-origin',
      method: 'PUT',
      headers: this.csrfHeader,
      body: JSON.stringify({ ...data }),
    })
  }

  async updatePivotField(pivotFieldId, fieldTypeID) {
    const response = await fetch(`/script_builder/pivot_fields/${pivotFieldId}`, {
      credentials: 'same-origin',
      method: 'PUT',
      headers: this.csrfHeader,
      body: JSON.stringify({ field_type: fieldTypeID }),
    })
    const data = await response.json();
    const pivotFields = await this.state.pivot_fields.map(pivotField => {
      if (pivotField.id === data.id) {
        pivotField.field_type = data.field_type
      }
      return pivotField
    })
    this.setState({ pivot_fields: pivotFields })
  }

  async deleteDataField(dataFieldId) {
    console.log('delete data field')
    this.removeRelatedPivotFields(dataFieldId)
    const deleteIndex = this.state.data_fields.findIndex(f => f.id === dataFieldId)
    const response = await fetch(`/script_builder/data_fields/${dataFieldId}`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: this.csrfHeader,
    })
    this.setState({
      data_fields: update(this.state.data_fields, { $splice: [[deleteIndex, 1]] }),
    })
  }

  async deletePivotField(pivotFieldId) {
    console.log('delete pivot field')
    const deleteIndex = this.state.pivot_fields.findIndex(f => f.id === pivotFieldId)
    const response = await fetch(`/script_builder/pivot_fields/${pivotFieldId}`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: this.csrfHeader,
    })
    this.setState({
      pivot_fields: update(this.state.pivot_fields, { $splice: [[deleteIndex, 1]] }),
    })
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
            onChange={(e) => this.setState({ munger_name: e.target.value })}
            onBlur={(e) => this.updateMunger({ munger_name: this.state.munger_name }, e)}
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
