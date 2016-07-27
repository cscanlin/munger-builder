const React = require('react');

class PivotField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data_field: this.props.data_field,
      field_type: 3, // Redux
      active_name: this.props.active_name,
    };
    this.fieldTypeName = this.fieldTypeName.bind(this);
  }

  fieldTypeName() {
    const fieldTypeMap = { 3: 'count' }; // Redux
    return fieldTypeMap[this.state.field_type];
  }

  render() {
    return (<div>{this.state.active_name} - {this.fieldTypeName()}</div>);
  }

}

PivotField.propTypes = {
  data_field: React.PropTypes.number.isRequired,
  active_name: React.PropTypes.string.isRequired, // Redux
};
module.exports = PivotField;
