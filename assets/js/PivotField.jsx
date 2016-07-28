const React = require('react');

class PivotField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      data_field: this.props.data_field,
      field_type: this.props.field_type,
    };
  }

  componentDidMount() {
    console.log('created pivot field');
  }

  componentWillUnmount() {
    console.log('removed pivot field');
  }

  render() {
    return (
      <div onClick={() => this.props.deletePivotField(this.props.id)}>
        ({this.props.id}) {this.props.activeName(this.props.data_field)} -
         {this.props.fieldTypeName(this.state.field_type)}
      </div>);
  }

}

PivotField.propTypes = {
  id: React.PropTypes.number.isRequired,
  data_field: React.PropTypes.number.isRequired,
  field_type: React.PropTypes.number.isRequired,
  deletePivotField: React.PropTypes.func.isRequired,
  fieldTypeName: React.PropTypes.func.isRequired, // Redux/remove here
  activeName: React.PropTypes.func.isRequired, // Redux
};
module.exports = PivotField;
