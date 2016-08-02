const React = require('react')
const DragSource = require('react-dnd').DragSource

const Button = require('./Button')
const AggregateChooser = require('./AggregateChooser')

const pivotFieldSource = {
  beginDrag(props) {
    console.log('begin pivot field drag')
    return { pivotField: props.id, fieldType: props.field_type }
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
    this.showAggregateChooser = this.showAggregateChooser.bind(this)
    this.hideAggregateChooser = this.hideAggregateChooser.bind(this)
  }


  componentDidMount() {
    console.log('mount pivot field')
  }

  componentWillUnmount() {
    console.log('unmount pivot field')
  }

  showAggregateChooser() {
    console.log('show agg chooser')
    document.body.addEventListener('click', this.hideAggregateChooser)
    this.setState({ showAggregateChooser: true })
  }

  hideAggregateChooser(e) {
    if (e.target.hasAttribute('data-field-type')) {
      console.log('agg selected')
      const fieldTypeID = e.target.getAttribute('data-field-type')
      this.props.updatePivotField(this.props.id, fieldTypeID)
    }
    document.body.removeEventListener('click', this.hideAggregateChooser)
    this.setState({ showAggregateChooser: false })
  }

  render() {
    const fieldTypeName = this.props.getFieldTypeName(this.props.field_type)
    const pivotFieldClass = `${fieldTypeName}-field list-group-item`
    const fullFieldText = `${fieldTypeName} of ${this.props.getActiveName(this.props.data_field)}`
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
            onClick={this.showAggregateChooser}
          />
          : null
        }
      {this.state.showAggregateChooser
        ? <AggregateChooser {...this.props} />
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
  deletePivotField: React.PropTypes.func.isRequired,
  getFieldTypeName: React.PropTypes.func.isRequired,
  getActiveName: React.PropTypes.func.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired,
  aggregateFieldTypes: React.PropTypes.array.isRequired,
  updatePivotField: React.PropTypes.func.isRequired,
}
module.exports = DragSource('PivotField', pivotFieldSource, collect)(PivotField)
