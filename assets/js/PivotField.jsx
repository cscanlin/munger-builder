const React = require('react');

class PivotField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      data_field: this.props.data_field,
      field_type: this.props.field_type,
      active_name: this.props.active_name, // Redux
    };
    this.fieldTypeName = this.fieldTypeName.bind(this);
  }

  componentDidMount() {
    console.log('created pivot field');
  }

  componentWillUnmount() {
    console.log('removed pivot field');
  }

  fieldTypeName() {
    // Redux fieldTypeMap
    return this.props.fieldTypeMap()[this.state.field_type];
  }

  render() {
    return (
      <div onClick={this.onClick}>
        ({this.state.id}) {this.state.active_name} - {this.fieldTypeName()}
      </div>);
  }

}

PivotField.propTypes = {
  id: React.PropTypes.number.isRequired,
  data_field: React.PropTypes.number.isRequired,
  field_type: React.PropTypes.number.isRequired,
  active_name: React.PropTypes.string.isRequired, // Redux
  fieldTypeMap: React.PropTypes.func.isRequired, // Redux/remove here
};
module.exports = PivotField;
