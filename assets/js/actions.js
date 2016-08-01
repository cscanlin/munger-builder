/*
 * action types
 */

export const SET_ACTIVE_NAME = 'SET_ACTIVE_NAME'
export const ADD_DATA_FIELD = 'ADD_DATA_FIELD'
export const ADD_PIVOT_FIELD = 'ADD_PIVOT_FIELD'
export const ADD_FIELD_TYPE = 'ADD_FIELD_TYPE'
/*
 * action creators
 */

export function setActiveName(dataFieldId, activeName) {
  return { type: SET_ACTIVE_NAME, dataFieldId, activeName }
}

export function addDataField(dataField) {
  return { type: ADD_DATA_FIELD, dataField }
}

export function addPivotField(pivotField) {
  return { type: ADD_PIVOT_FIELD, pivotField }
}

export function addFieldType(fieldType) {
  return { type: ADD_FIELD_TYPE, fieldType }
}
