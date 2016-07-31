const React = require('react')

class PivotField extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      data_field: this.props.data_field,
      field_type: this.props.field_type,
    }
  }

  componentDidMount() {
    console.log('mount pivot field')
  }

  componentWillUnmount() {
    console.log('unmount pivot field')
  }

  render() {
    const fieldTypeName = this.props.fieldTypeName(this.state.field_type)
    const pivotFieldClass = `${fieldTypeName}-field list-group-item`
    return (
      <div className={pivotFieldClass}>
        <div className="field-text">
          <span className="aggregate-text">{fieldTypeName} of </span>
          <span className="name-text">{this.props.activeName(this.props.data_field)}</span>
        </div>
      </div>
    )
  }

}
// <div onClick={() => this.props.deletePivotField(this.props.id)}>

PivotField.propTypes = {
  id: React.PropTypes.number.isRequired,
  data_field: React.PropTypes.number.isRequired,
  field_type: React.PropTypes.number.isRequired,
  deletePivotField: React.PropTypes.func.isRequired,
  fieldTypeName: React.PropTypes.func.isRequired, // Redux/remove here
  activeName: React.PropTypes.func.isRequired, // Redux
}
module.exports = PivotField
