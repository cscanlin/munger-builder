var React = require('react')
var ReactDOM = require('react-dom');
var $ = require ('jquery')
var Cookie = require ('js-cookie')
var Button = require('./Button');

var BaseField = React.createClass({
  getInitialState: function() {
    return {
      id: this.props.field.id,
      munger_builder: this.props.field.munger_builder,
      current_name: this.props.field.current_name,
      new_name: this.props.field.new_name,
      field_types: this.props.field.field_types,
      active_name: this.props.field.active_name,
      editing: false,
    };
  },

  render: function() {
    // console.log(this);
    return (
      <div
        id={this.elementID()}
        key={this.state.id}
        type="None"
        className="list-group-item">
        <Button
          type="image"
          src="/static/delete-icon-transparent.png"
          value="delete"
          className="delete-field-button"
          callback={this.delete}>
        </Button>
        <div
          className="field-text">
          <input
            id={"field-name-input-"+this.state.id}
            type="text"
            disabled={!this.state.editing}
            value={this.state.active_name}
            className="field-name-input"
            onChange={this.onChange}/>
          <Button
            type="image"
            src="/static/edit-icon.png"
            value="edit"
            className="small-image-button"
            callback={this.enableEditing}>
          </Button>
        </div>
      </div>
    );
  },

  elementID: function() { return "field-name-input-" + this.state.id },

  delete: function() {
    console.log(this);
    this.props.deleteField(this.state.id)
  },

  onChange: function(e){
    this.setState({active_name: e.target.value});
  },

  enableEditing: function(){
    // set your contenteditable field into editing mode.
    console.log('editing');
    this.setState({ editing: true })
    document.body.addEventListener('keypress', this.disableEditing)
    document.body.addEventListener('click', this.disableEditing)
  },

  disableEditing: function(e) {
    if (e.target.id != this.elementID() || e.key === 'Enter') {
      console.log('not editing');
      this.setState({ editing: false })
      document.body.removeEventListener('click', this.disableEditing);
      document.body.removeEventListener('keypress', this.disableEditing);
      if (this.state.active_name != this.state.new_name) {
        this.state.new_name = this.state.active_name
        $.ajax({
          beforeSend : function(jqXHR, settings) {
            jqXHR.setRequestHeader("x-csrftoken", Cookie.get('csrftoken'));
          },
          type: 'POST',
          url: '/script_builder/field/' + this.state.id,
          data: this.state
        })
      }
      e.preventDefault()
    }
  },

});

module.exports = BaseField;
