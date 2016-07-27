const React = require('react');
const Button = require('./Button');

class FieldBank extends React.Component {

  render() {
    return (
      <div>
        {this.props.children}
        <div className="add-field-button-container">
          <Button
            type="submit"
            src=""
            value="+"
            className="btn btn-primary"
            onClick={this.props.addField}
          />
        </div>
      </div>
    );
  }
}

FieldBank.propTypes = {
  addField: React.PropTypes.func.isRequired,
  children: React.PropTypes.node,
};

module.exports = FieldBank;
