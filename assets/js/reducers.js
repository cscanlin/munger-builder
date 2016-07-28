import { SET_ACTIVE_NAME } from './actions';

function pivotStoreApp(state = null, action) {
  switch (action.type) {
    case SET_ACTIVE_NAME:
      return Object.assign({}, state, {
        dataFieldId: action.dataFieldId,
        activeName: action.activeName,
      });
    default:
      return state;
  }
}

module.exports = pivotStoreApp;
