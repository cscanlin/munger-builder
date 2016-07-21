var React = require('react')
var FieldBank = require('./FieldBank')

var PivotApp = React.createClass({

  render: function() {
    return (
      <FieldBank source={this.props.source}></FieldBank>
    );
  }
});

module.exports = PivotApp;
