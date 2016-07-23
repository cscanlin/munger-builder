const React = require('react');
const $ = require('jquery');
const Cookie = require('js-cookie');
const Button = require('./Button');

class BaseField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.field.id,
      munger_builder: this.props.field.munger_builder,
      current_name: this.props.field.current_name,
      new_name: this.props.field.new_name,
      field_types: this.props.field.field_types,
      active_name: this.props.field.active_name,
      editing: false,
    };
    this.onChange = this.onChange.bind(this);
    this.delete = this.delete.bind(this);
    this.enableEditing = this.enableEditing.bind(this);
    this.disableEditing = this.disableEditing.bind(this);
  }

  onChange(e) {
    this.setState({ active_name: e.target.value });
  }

  elementID() { return `field-name-input-${this.state.id}`; }

  delete() {
    this.props.deleteField(this.state.id);
  }

  enableEditing() {
    // set your contenteditable field into editing mode.
    console.log('editing');
    this.setState({ editing: true });
    document.body.addEventListener('keypress', this.disableEditing);
    document.body.addEventListener('click', this.disableEditing);
  }

  disableEditing(e) {
    if (e.target.id !== this.elementID() || e.key === 'Enter') {
      console.log('not editing');
      this.setState({ editing: false });
      document.body.removeEventListener('click', this.disableEditing);
      document.body.removeEventListener('keypress', this.disableEditing);
      if (this.state.active_name !== this.state.new_name) {
        this.state.new_name = this.state.active_name;
        $.ajax({
          beforeSend(jqXHR) {
            jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'));
          },
          type: 'POST',
          url: `/script_builder/field/${this.state.id}`,
          data: this.state,
        });
      }
      e.preventDefault();
    }
  }

  render() {
    return (
      <div
        id={this.elementID()}
        key={this.state.id}
        type="None"
        className="list-group-item"
      >
        <Button
          type="image"
          src="/static/delete-icon-transparent.png"
          value="delete"
          className="delete-field-button"
          onClick={this.delete}
        />
        <div
          className="field-text"
        >
          <input
            id={`field-name-input-${this.state.id}`}
            type="text"
            disabled={!this.state.editing}
            value={this.state.active_name}
            className="field-name-input"
            onChange={this.onChange}
          />
          <Button
            type="image"
            src="/static/edit-icon.png"
            value="edit"
            className="small-image-button"
            onClick={this.enableEditing}
          />
        </div>
      </div>
    );
  }
}

BaseField.propTypes = {
  field: React.PropTypes.object.isRequired,
  deleteField: React.PropTypes.func.isRequired,
};
module.exports = BaseField;
