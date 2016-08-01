const React = require('react')
const ReactDOM = require('react-dom')
const PivotApp = require('./PivotApp')

// TODO Refactor to pass argument directly to PivotApp
const $ = require('jquery')
const mungerId = parseInt($('#mb-id').attr('value'), 10)

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import pivotStoreApp from './reducers'

ReactDOM.render(
  <Provider store={createStore(pivotStoreApp)}>
    <PivotApp mungerId={mungerId} />
  </Provider>,
  document.getElementById('pivot-app')
)
