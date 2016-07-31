const React = require('react')
const $ = require('jquery')
const Cookie = require('js-cookie')
const update = require('react-addons-update')
const DataField = require('./DataField')
const FieldBank = require('./FieldBank')
const MainTable = require('./MainTable')
const PivotField = require('./PivotField')
const ScriptBuilder = require('./ScriptBuilder')

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
      munger_template: '',
      output_path: '',
      rows_to_delete_bottom: null,
      rows_to_delete_top: null,
    }
    this.newFieldName = this.newFieldName.bind(this)
    this.addDataField = this.addDataField.bind(this)
    this.addPivotField = this.addPivotField.bind(this)
    this.deleteDataField = this.deleteDataField.bind(this)
    this.deletePivotField = this.deletePivotField.bind(this)
    this.fieldTypeName = this.fieldTypeName.bind(this)
    this.activeName = this.activeName.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.removeRelatedPivotFields = this.removeRelatedPivotFields.bind(this)
  }

  componentDidMount() {
    const source = `/script_builder/mungers/${this.props.mungerId}?format=json`
    this.serverRequest = $.get(source, result => this.onMount(result))
  }

  componentWillUnmount() {
    this.serverRequest.abort()
  }

  onMount(result) {
    this.setState({ data_fields: result.data_fields })
    this.setState({ pivot_fields: result.pivot_fields })
    this.setState({ field_types: result.field_types })
    this.setState({ ...result })
    // this.setState({ default_aggregate_field_type: result.default_aggregate_field_type })
  }

  handleNameChange(dataFieldId, activeName) {
    this.state.data_fields.map(dataField => {
      if (dataField.id === dataFieldId) {
        dataField.active_name = activeName
      }
      return dataField
    })
    this.setState({ data_fields: this.state.data_fields })
  }

  newFieldName() {
    // TODO Redux - Will not update if fields have changed without reloading
    let numNewFields = this.state.data_fields.filter(item =>
      item.active_name.startsWith('New Field')
    ).length
    if (numNewFields > 0) {
      numNewFields += 1
      return `New Field ${numNewFields}`
    }
    return 'New Field'
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

  fieldTypeName(fieldTypeId, returnFunctionName = false) {
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

  activeName(dataFieldId) {
    const activeNameMap = {}
    this.state.data_fields.map(dataField => {
      activeNameMap[dataField.id] = dataField.active_name
      return activeNameMap
    })
    return activeNameMap[dataFieldId]
  }

  render() {
    return (
      <div className="pivot-app">

        <FieldBank addDataField={this.addDataField}>
          {this.state.data_fields.map(dataField =>
            <DataField
              key={dataField.id}
              deleteDataField={this.deleteDataField}
              addPivotField={this.addPivotField}
              handleNameChange={this.handleNameChange}
              {...dataField}
            />
          )}
        </FieldBank>
        <MainTable>
          {this.state.pivot_fields.map(pivotField =>
            <PivotField
              key={pivotField.id}
              deletePivotField={this.deletePivotField}
              fieldTypeName={this.fieldTypeName}
              activeName={this.activeName}
              {...pivotField}
            />
          )}
        </MainTable>
        <ScriptBuilder
          activeName={this.activeName}
          fieldTypeName={this.fieldTypeName}
          {...this.state}
        />
      </div>
    )
  }
}


PivotApp.propTypes = {
  mungerId: React.PropTypes.number.isRequired,
}
module.exports = PivotApp
