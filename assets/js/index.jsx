const React = require('react')
const ReactDOM = require('react-dom')
const PivotApp = require('./PivotApp')

// TODO Refactor to pass argument directly to PivotApp
const $ = require('jquery')
const mungerId = parseInt($('#mb-id').attr('value'), 10)

ReactDOM.render(<PivotApp mungerId={mungerId} />, document.getElementById('pivot-app'))
