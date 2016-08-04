const React = require('react')
const Button = require('./Button')

class FieldBank extends React.Component {

  render() {
    return (
      <div>
        {this.props.children}
        <div className="add-field-button-container">
          <Button
            type="button"
            value={this.props.showOriginalNames ? 'Show Replacement Names' : 'Show Original Names'}
            className="btn btn-primary toggle-show-pivot-only script-builder-button"
            onClick={this.props.toggleOriginalNames}
          />
          <Button
            type="submit"
            src=""
            value="+"
            className="btn btn-primary"
            onClick={this.props.addDataField}
          />
        </div>
      </div>
    )
  }
}

FieldBank.propTypes = {
  addDataField: React.PropTypes.func.isRequired,
  showOriginalNames: React.PropTypes.bool.isRequired,
  toggleOriginalNames: React.PropTypes.func.isRequired,
  children: React.PropTypes.node,
}

module.exports = FieldBank
