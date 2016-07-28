/*
 * action types
 */

export const SET_ACTIVE_NAME = 'SET_ACTIVE_NAME';
/*
 * action creators
 */

export function setActiveName(dataFieldId, activeName) {
  return { type: SET_ACTIVE_NAME, dataFieldId, activeName };
}
