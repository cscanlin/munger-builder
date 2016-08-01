const React = require('react')
const DragSource = require('react-dnd').DragSource

const Button = require('./Button')
const AggregateChooser = require('./AggregateChooser')

const pivotFieldSource = {
  beginDrag(props) {
    console.log('begin pivot field drag')
    return { pivotField: props.id }
  },
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class PivotField extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showAggregateChooser: false,
    }
    this.toggleAggregateChooser = this.toggleAggregateChooser.bind(this)
  }


  componentDidMount() {
    console.log('mount pivot field')
  }

  componentWillUnmount() {
    console.log('unmount pivot field')
  }

  toggleAggregateChooser() {
    const showHide = !this.state.showAggregateChooser
    this.setState({ showAggregateChooser: showHide })
  }

  render() {
    const fieldTypeName = this.props.getFieldTypeName(this.props.field_type)
    const pivotFieldClass = `${fieldTypeName}-field list-group-item`
    const fullFieldText = `${fieldTypeName} of ${this.props.active_name}`
    const fieldTextStyle = {
      fontSize: 18.5 - fullFieldText.length / 4,
    }
    return this.props.connectDragSource(
      <div className={pivotFieldClass} style={fieldTextStyle}>
        <div className="field-text">
          {fullFieldText}
        </div>
        {this.props.field_type > 2
          ? <Button
            type="image"
            src="/static/hamburger.png"
            value="toggle"
            className="small-image-button right aggregate-chooser-toggle"
            onClick={this.toggleAggregateChooser}
          />
          : null
        }
      {this.state.showAggregateChooser
        ? <AggregateChooser
          aggregateFieldTypes={this.props.aggregateFieldTypes}
          getFieldTypeName={this.props.getFieldTypeName}
        />
        : null
      }
      </div>
    )
  }
}

PivotField.propTypes = {
  id: React.PropTypes.number.isRequired,
  data_field: React.PropTypes.number.isRequired,
  field_type: React.PropTypes.number.isRequired,
  active_name: React.PropTypes.string.isRequired,
  deletePivotField: React.PropTypes.func.isRequired,
  getFieldTypeName: React.PropTypes.func.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired,
  aggregateFieldTypes: React.PropTypes.array.isRequired,
}
module.exports = DragSource('PivotField', pivotFieldSource, collect)(PivotField)
