const $ = require('jquery')
const Cookie = require('js-cookie')
const update = require('react-addons-update')

class Api {
  updateMunger(data, e) {
    if (e) {
      this.setState({ ...data })
      if (e.type === 'blur' || e.type === 'save') {
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
}
module.exports = Api
