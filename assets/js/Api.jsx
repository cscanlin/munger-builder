const Cookie = require('js-cookie')
const update = require('react-addons-update')

const Logger = require('./Logger')

const csrfHeader = new Headers({
  'x-csrftoken': Cookie.get('csrftoken'),
  'Accept': 'application/json',
  'Content-Type': 'application/json',
})

class Api {

  static async loadInitial() {
    const response = await fetch(`/script_builder/mungers/${this.props.mungerId}?format=json`, {
      credentials: 'same-origin',
      method: 'GET',
      headers: csrfHeader,
    })
    const result = await response.json();
    this.setState({ ...result })
  }

  static async updateMunger(data, e) {
    if (e) {
      this.setState({ ...data })
      if (e.type === 'blur' || e.type === 'save') {
        const response = await fetch(`/script_builder/mungers/${this.props.mungerId}`, {
          credentials: 'same-origin',
          method: 'PUT',
          headers: csrfHeader,
          body: JSON.stringify({ ...data }),
        })
      }
    }
  }

  static async addDataField() {
    Logger.log('add data field')
    const newDataField = {
      munger_builder: this.props.mungerId,
      current_name: `New Field #${this.state.data_fields.length + 1}`,
    }
    const response = await fetch('/script_builder/data_fields/', {
      credentials: 'same-origin',
      method: 'POST',
      headers: csrfHeader,
      body: JSON.stringify({ ...newDataField }),
    })
    const data = await response.json();
    this.setState({ data_fields: this.state.data_fields.concat([data]) })
  }

  static async updateDataField(dataFieldId, data) {
    Logger.log('update data field')
    const response = await fetch(`/script_builder/data_fields/${dataFieldId}`, {
      credentials: 'same-origin',
      method: 'PUT',
      headers: csrfHeader,
      body: JSON.stringify({ ...data }),
    })
  }

  static async deleteDataField(dataFieldId) {
    Logger.log('delete data field')
    this.removeRelatedPivotFields(dataFieldId)
    const deleteIndex = this.state.data_fields.findIndex(f => f.id === dataFieldId)
    const response = await fetch(`/script_builder/data_fields/${dataFieldId}`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: csrfHeader,
    })
    this.setState({
      data_fields: update(this.state.data_fields, { $splice: [[deleteIndex, 1]] }),
    })
  }

  static async addPivotField(dataFieldId, fieldTypeId) {
    Logger.log('add pivot field')
    const newPivotField = {
      data_field: dataFieldId,
      field_type: fieldTypeId || this.state.default_aggregate_field_type,
    }
    const response = await fetch('/script_builder/pivot_fields/', {
      credentials: 'same-origin',
      method: 'POST',
      headers: csrfHeader,
      body: JSON.stringify({ ...newPivotField }),
    })
    const data = await response.json();
    this.setState({ pivot_fields: this.state.pivot_fields.concat([data]) })
  }

  static async updatePivotField(pivotFieldId, fieldTypeID) {
    Logger.log('update pivot field');
    const response = await fetch(`/script_builder/pivot_fields/${pivotFieldId}`, {
      credentials: 'same-origin',
      method: 'PUT',
      headers: csrfHeader,
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

  static async deletePivotField(pivotFieldId) {
    Logger.log('delete pivot field')
    const deleteIndex = this.state.pivot_fields.findIndex(f => f.id === pivotFieldId)
    const response = await fetch(`/script_builder/pivot_fields/${pivotFieldId}`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: csrfHeader,
    })
    this.setState({
      pivot_fields: update(this.state.pivot_fields, { $splice: [[deleteIndex, 1]] }),
    })
  }
}
module.exports = Api
