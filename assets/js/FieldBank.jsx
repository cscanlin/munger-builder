var React = require('react')
var $ = require ('jquery')
var BaseField = require('./BaseField');

var FieldBank = React.createClass({
  getInitialState: function() {
    return {fields: []};
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {
      this.setState({fields: result});
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (
      <div>
        {this.state.fields.map(function(field) {
          return (
            <BaseField key={field.id} field={field}></BaseField>
          )
        })}
      </div>
    );
  }
});

module.exports = FieldBank;
