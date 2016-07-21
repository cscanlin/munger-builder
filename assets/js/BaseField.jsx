var React = require('react')
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
        id={'source-field-' + this.state.id}
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

  delete: function() {
    $.ajax({
      beforeSend : function(jqXHR, settings) {
        jqXHR.setRequestHeader("x-csrftoken", Cookie.get('csrftoken'));
      },
      type: 'DELETE',
      url: '/script_builder/field/' + this.state.id,
    })
    // ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
  },

  onChange: function(e){
    this.setState({active_name: e.target.value});
  },

  enableEditing: function(){
    // set your contenteditable field into editing mode.
    console.log('editing');
    this.setState({ editing: true })
    document.body.addEventListener('click', this.disableEditing)
  },

  disableEditing: function(e) {
    if (e.target.id != "field-name-input-"+this.state.id) {
      console.log('not editing');
      this.setState({ editing: false })
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
    }
  },

});

module.exports = BaseField;
