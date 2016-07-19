var React = require('react')
var ReactDOM = require('react-dom');
var $ = require ('jquery')

module.exports = React.createClass({
  getInitialState: function() {
    return {
      munger_builder: '',
      current_name: '',
      new_name: '',
      field_types: '',
    };
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {
      var field = result[0];
      this.setState({
        munger_builder: field.munger_builder,
        current_name: field.current_name,
        new_name: field.new_name,
        field_types: field.field_types,
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (
      <div>
        <span>{this.state.munger_builder}</span>
        <span>{this.state.current_name}</span>
        <span>{this.state.new_name}</span>
        <span>{this.state.field_types}</span>
      </div>
    );
  }
});
