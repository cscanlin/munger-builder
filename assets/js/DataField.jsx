const React = require('react');
const DragSource = require('react-dnd').DragSource

const Button = require('./Button')
import { setActiveName } from './actions'

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
      id: this.props.id,
      munger_builder: this.props.munger_builder,
      current_name: this.props.current_name,
      new_name: this.props.new_name,
      active_name: this.props.active_name,
      editing: false,
      active: false,
    }
    this.onChange = this.onChange.bind(this)
    this.enableEditing = this.enableEditing.bind(this)
    this.disableEditing = this.disableEditing.bind(this)
  }

  onChange(e) {
    this.setState({ active_name: e.target.value })
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
      this.props.updateDataField(this.state)
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
          className="delete-field-button"
          onClick={() => this.props.deleteDataField(this.props.id)}
        />
        <div
          className="field-text"
        >
          <input
            id={this.inputID()}
            type="text"
            disabled={!this.state.editing}
            value={this.state.active_name}
            className="field-name-input"
            onChange={this.onChange}
          />
          <Button
            type="image"
            src="/static/edit-icon.png"
            value="edit"
            className="small-image-button"
            onClick={this.enableEditing}
          />
        </div>
      </div>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     dataFieldId: state.id,
//     activeName: state.active_name,
//   };
// };
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onClick: () => {
//       dispatch(setVisibilityFilter(ownProps.filter))
//     }
//   }
// }


DataField.propTypes = {
  store: React.PropTypes.object,
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
