var React = require('react')
var ReactDOM = require('react-dom');
var $ = require ('jquery')
var Cookie = require ('js-cookie')
var BaseField = require('./BaseField');
var Button = require('./Button');

var FieldBank = React.createClass({
  getInitialState: function() {
    return {fields: []};
  },

  componentDidMount: function() {
    var source = '/script_builder/munger/' + this.props.mungerId + '/fields?format=json'
    this.serverRequest = $.get(source, function (result) {
      this.setState({fields: result});
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  addField: function() {
    var field = {
      munger_builder: this.props.mungerId,
      current_name: this.newFieldName(),
    }
    var fields = this.state.fields
    $.ajax({
      beforeSend : function(jqXHR, settings) {
        jqXHR.setRequestHeader("x-csrftoken", Cookie.get('csrftoken'));
      },
      type: 'POST',
      url: '/script_builder/field/create',
      data: field,
      success: function(data) {
        fields.push(data)
        this.setState({fields: fields});
      }.bind(this),
    })
  },

  newFieldName: function() {
    // TODO Will not update if fields have changed without reloading
    var numNewFields = this.state.fields.filter(function(item) {
      return item.active_name.startsWith('New Field')
    }).length
    if (numNewFields > 0) {
      numNewFields += 1
      return "New Field " + numNewFields
    } else {
      return "New Field"
    }
  },

  deleteField: function(fieldID) {
    var fields = this.state.fields
    for (var i = 0; i < fields.length; i++)
      if (fields[i].id === fieldID) {
          fields.splice(i, 1);
          break;
      }

    console.log('delete');
    $.ajax({
      beforeSend : function(jqXHR, settings) {
        jqXHR.setRequestHeader("x-csrftoken", Cookie.get('csrftoken'));
      },
      type: 'DELETE',
      url: '/script_builder/field/' + fieldID
    })
    this.setState({fields: fields});
  },

  render: function() {
    var deleteField = this.deleteField
    return (
      <div>
        <div>
          {this.state.fields.map(function(field) {
            return (
              <BaseField deleteField={deleteField} key={field.id} field={field}></BaseField>
            )
          })}
        </div>
        <div
          className="add-field-button-container">
          <Button
            type="submit"
            src=""
            value="+"
            className="btn btn-primary"
            callback={this.addField}>
          </Button>
        </div>
      </div>
    );
  }
});

module.exports = FieldBank;
