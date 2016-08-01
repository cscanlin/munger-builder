const React = require('react')
const DragSource = require('react-dnd').DragSource

const Button = require('./Button')

const dataFieldSource = {
  beginDrag(props) {
    console.log('begin data field drag')
    return { dataField: props.id }
  },
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class DataField extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editing: false,
    }
    this.onChange = this.onChange.bind(this)
    this.enableEditing = this.enableEditing.bind(this)
    this.disableEditing = this.disableEditing.bind(this)
  }

  onChange(e) {
    this.props.handleNameChange(this.props.id, e.target.value)
  }

  elementID() { return `base-field-${this.props.id}` }

  inputID() { return `field-name-input-${this.props.id}` }

  enableEditing() {
    console.log('editing')
    this.setState({ editing: true })
    document.body.addEventListener('keypress', this.disableEditing)
    document.body.addEventListener('click', this.disableEditing)
  }

  disableEditing(e) {
    if (e.target.id !== this.inputID() || e.key === 'Enter') {
      console.log('not editing')
      this.setState({ editing: false })
      document.body.removeEventListener('click', this.disableEditing)
      document.body.removeEventListener('keypress', this.disableEditing)
      if (this.props.new_name !== this.props.active_name) {
        this.props.updateDataField(this.props.id, this.props.active_name)
      }
      e.preventDefault()
    }
  }

  render() {
    let fieldStyle = {
      opacity: this.props.isDragging ? 0.9 : 1,
    }

    return this.props.connectDragSource(
      <div
        id={this.elementID()}
        key={this.props.id}
        style={fieldStyle}
        type="None"
        className="list-group-item"
        onClick={this.onClick}
      >
        <Button
          type="image"
          src="/static/delete-icon-transparent.png"
          value="delete"
          className="small-image-button left"
          onClick={() => this.props.deleteDataField(this.props.id)}
        />
        <div className="field-text">
          <input
            id={this.inputID()}
            type="text"
            disabled={!this.state.editing}
            value={this.props.active_name}
            className="field-name-input"
            onChange={this.onChange}
          />
        </div>
        <Button
          type="image"
          src="/static/edit-icon.png"
          value="edit"
          className="small-image-button right"
          onClick={this.enableEditing}
        />
      </div>
    )
  }
}

DataField.propTypes = {
  id: React.PropTypes.number.isRequired,
  munger_builder: React.PropTypes.number.isRequired,
  current_name: React.PropTypes.string.isRequired,
  new_name: React.PropTypes.string,
  active_name: React.PropTypes.string.isRequired,
  updateDataField: React.PropTypes.func.isRequired,
  deleteDataField: React.PropTypes.func.isRequired,
  handleNameChange: React.PropTypes.func.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired,
}
module.exports = DragSource('DataField', dataFieldSource, collect)(DataField)
