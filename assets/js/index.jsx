var React = require('react')
var ReactDOM = require('react-dom');
var App = require('./app')

ReactDOM.render(<App source="http://127.0.0.1:8000/script_builder/munger_fields/1?format=json"/>, document.getElementById('react-app'));
