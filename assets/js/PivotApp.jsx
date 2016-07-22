var React = require('react')
var FieldBank = require('./FieldBank')

var PivotApp = React.createClass({

  render: function() {
    return (
      <FieldBank mungerId={this.props.mungerId}></FieldBank>
    );
  }
});

module.exports = PivotApp;
