const React = require('react')
const ReactDOM = require('react-dom')
const PivotApp = require('./PivotApp')

// TODO Refactor to pass argument directly to PivotApp
const mungerId = parseInt(document.getElementById('#mb-id').value)

ReactDOM.render(<PivotApp mungerId={mungerId} />, document.getElementById('pivot-app'))
