const React = require('react')
const titleize = require('titleize')

class AdditionalOptionsField extends React.Component {

  fieldLabel() { return titleize(this.props.fieldName.replace(/_/g, ' ')) }

  fieldId() { return `options-${this.props.fieldName}` }

  fieldUpdateData(e) {
    const data = {}
    data[this.props.fieldName] = (
      this.props.type === 'number' ? parseInt(e.target.value) : e.target.value
    )
    return data
  }

  render() {
    return (
      <div className="additional-options-field">
        <label htmlFor={this.fieldId()}>{this.fieldLabel()}</label>
        <input
          id={this.fieldId()}
          type={this.props.type}
          className={`additional-options-input ${this.props.type}`}
          placeholder={this.fieldLabel()}
          value={this.props.fieldValue}
          onChange={(e) => this.props.updateMunger(this.fieldUpdateData(e), e)}
          onBlur={(e) => this.props.updateMunger(this.fieldUpdateData(e), e)}
        />
      </div>
    )
  }
}
AdditionalOptionsField.propTypes = {
  type: React.PropTypes.string.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  fieldValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]).isRequired,
  updateMunger: React.PropTypes.func.isRequired,
}

module.exports = AdditionalOptionsField
