const React = require('react')

function Button(props) {
  return <input {...props} />
}

Button.propTypes = {
  type: React.PropTypes.string,
  src: React.PropTypes.string,
  value: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired,
}
module.exports = Button
