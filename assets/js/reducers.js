import { SET_ACTIVE_NAME } from './actions'

function pivotStoreApp(state = { activeNameMap: {} }, action) {
  switch (action.type) {
    case SET_ACTIVE_NAME:
      state.activeNameMap[action.dataFieldId] = action.activeName
      return Object.assign({}, state)
    default:
      return state
  }
}

module.exports = pivotStoreApp
