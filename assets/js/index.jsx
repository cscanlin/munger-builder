const React = require('react')
const ReactDOM = require('react-dom')
const PivotAppLink = require('./containers/PivotAppLink')

// TODO Refactor to pass argument directly to PivotApp
const $ = require('jquery')
const mungerId = parseInt($('#mb-id').attr('value'), 10)

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import pivotStore from './reducers'

const store = createStore(pivotStore)

ReactDOM.render(
  <Provider store={store}>
    <PivotAppLink mungerId={mungerId} />
  </Provider>,
  document.getElementById('pivot-app')
)
