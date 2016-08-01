import { SET_ACTIVE_NAME, ADD_DATA_FIELD, ADD_PIVOT_FIELD, ADD_FIELD_TYPE } from './actions'

function pivotStore(state = { activeNameMap: {} }, action) {
  switch (action.type) {
    case SET_ACTIVE_NAME:
      state.activeNameMap[action.dataFieldId] = action.activeName
      return Object.assign({}, state)
    case ADD_DATA_FIELD:
      state.data_fields.push(action.dataField)
      return Object.assign({}, state)
    case ADD_PIVOT_FIELD:
      state.pivot_fields.push(action.pivotField)
      return Object.assign({}, state)
    case ADD_FIELD_TYPE:
      state.field_types.push(action.fieldType)
      return Object.assign({}, state)
    default:
      return state
  }
}

module.exports = pivotStore
