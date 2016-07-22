const React = require('react');

function Button(props) {
  return (
    <input
      type={props.type}
      src={props.src}
      value={props.value}
      className={props.className}
      onClick={props.callback}
    />
  );
}

Button.propTypes = {
  type: React.PropTypes.string.isRequired,
  src: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  className: React.PropTypes.string.isRequired,
  callback: React.PropTypes.func.isRequired,
};
module.exports = Button;
