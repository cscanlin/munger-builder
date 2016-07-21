var React = require('react')
var ReactDOM = require('react-dom');
var PivotApp = require('./PivotApp')

ReactDOM.render(<PivotApp source="/script_builder/munger/1/fields?format=json"/>, document.getElementById('pivot-app'));
