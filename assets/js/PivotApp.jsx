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
    }
    this.newFieldName = this.newFieldName.bind(this)
    this.addDataField = this.addDataField.bind(this)
    this.addPivotField = this.addPivotField.bind(this)
    this.updateMunger = this.updateMunger.bind(this)
    this.updatePivotField = this.updatePivotField.bind(this)
    this.updateDataField = this.updateDataField.bind(this)
    this.deleteDataField = this.deleteDataField.bind(this)
    this.deletePivotField = this.deletePivotField.bind(this)
    this.getFieldTypeName = this.getFieldTypeName.bind(this)
    this.getActiveName = this.getActiveName.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.removeRelatedPivotFields = this.removeRelatedPivotFields.bind(this)
    this.aggregateFieldTypes = this.aggregateFieldTypes.bind(this)
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

  getActiveName(dataFieldId) {
    const activeNameMap = {}
    this.state.data_fields.map(dataField => {
      activeNameMap[dataField.id] = dataField.active_name
      return activeNameMap
    })
    return activeNameMap[dataFieldId]
  }

  aggregateFieldTypes() { return this.state.field_types.filter(fieldType => fieldType.id > 2) }

  handleNameChange(dataFieldId, activeName) {
    console.log(dataFieldId)
    this.state.data_fields.map(dataField => {
      if (dataField.id === dataFieldId) {
        dataField.active_name = activeName
      }
      return dataField
    })
    this.setState({ data_fields: this.state.data_fields })
  }

  newFieldName() {
    let numNewFields = this.state.data_fields.filter(item =>
      item.active_name.startsWith('New Field')
    ).length
    if (numNewFields > 0) {
      numNewFields += 1
      return `New Field ${numNewFields}`
    }
    return 'New Field'
  }

  updateMunger(data, e) {
    if (e) {
      this.setState({ ...data })
      if (e.type === 'blur') {
        $.ajax({
          beforeSend(jqXHR) {
            jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'))
          },
          type: 'PUT',
          url: `/script_builder/mungers/${this.props.mungerId}`,
          data: { ...data },
        })
      }
    }
  }

  addDataField() {
    console.log('add data field')
    const newDataField = {
      munger_builder: this.props.mungerId,
      current_name: this.newFieldName(),
    }
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'))
      },
      type: 'POST',
      url: '/script_builder/data_fields/',
      data: newDataField,
      success: data => {
        this.setState({ data_fields: this.state.data_fields.concat([data]) })
      },
    })
  }

  addPivotField(dataFieldId, fieldTypeId) {
    console.log('add pivot field')
    const newPivotField = {
      data_field: dataFieldId,
      field_type: fieldTypeId || this.state.default_aggregate_field_type,
    }
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'))
      },
      type: 'POST',
      url: '/script_builder/pivot_fields/',
      data: newPivotField,
      success: data => {
        this.setState({ pivot_fields: this.state.pivot_fields.concat([data]) })
      },
    })
  }

  updateDataField(dataFieldId, newName) {
    console.log('update pivot field')
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'))
      },
      type: 'PUT',
      url: `/script_builder/data_fields/${dataFieldId}`,
      data: { new_name: newName },
    })
  }

  updatePivotField(pivotFieldId, fieldTypeID) {
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'))
      },
      type: 'PUT',
      url: `/script_builder/pivot_fields/${pivotFieldId}`,
      data: { field_type: fieldTypeID },
      success: data => {
        this.state.pivot_fields.map(pivotField => {
          if (pivotField.id === data.id) {
            pivotField.field_type = data.field_type
          }
          return pivotField
        })
        this.setState({ pivot_fields: this.state.pivot_fields })
      },
    })
  }

  deleteDataField(dataFieldId) {
    console.log('delete data field')
    const deleteIndex = this.state.data_fields.findIndex(f => f.id === dataFieldId)
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'))
      },
      type: 'DELETE',
      url: `/script_builder/data_fields/${dataFieldId}`,
      success: this.setState({
        data_fields: update(this.state.data_fields, { $splice: [[deleteIndex, 1]] }),
      }),
    })
    this.removeRelatedPivotFields(dataFieldId)
  }

  removeRelatedPivotFields(dataFieldId) {
    const pivotFieldsToKeep = this.state.pivot_fields.filter(pivotField =>
      pivotField.data_field !== dataFieldId
    )
    this.setState({ pivot_fields: pivotFieldsToKeep })
  }

  deletePivotField(pivotFieldId) {
    console.log('delete pivot field')
    const deleteIndex = this.state.pivot_fields.findIndex(f => f.id === pivotFieldId)
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'))
      },
      type: 'DELETE',
      url: `/script_builder/pivot_fields/${pivotFieldId}`,
      success: this.setState({
        pivot_fields: update(this.state.pivot_fields, { $splice: [[deleteIndex, 1]] }),
      }),
    })
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
            onBlur={this.updateMunger({ munger_name: this.state.munger_name })}
          />
        </h3>
        <FieldBank addDataField={this.addDataField}>
          {this.state.data_fields.map(dataField =>
            <DataField key={dataField.id} {...this} {...dataField} />
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
