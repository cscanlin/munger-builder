var React = require('react')

var Button = React.createClass({

  render: function() {
    return (
      <input
        type={this.props.type}
        src={this.props.src}
        value={this.props.value}
        className={this.props.className}
        onClick={this.props.callback}>
      </input>
    );
  }
});

module.exports = Button;
