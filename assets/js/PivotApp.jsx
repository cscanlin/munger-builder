const React = require('react');
const FieldBank = require('./FieldBank');

class PivotApp extends React.Component {
  render() {
    return <FieldBank mungerId={this.props.mungerId} />;
  }
}

PivotApp.propTypes = {
  mungerId: React.PropTypes.number.isRequired,
};
module.exports = PivotApp;
