import { connect } from 'react-redux'
import PivotField from '../components/PivotField'

const mapStateToProps = (state, ownProps) => ({
  active_name: state.activeNameMap[ownProps.data_field],
})

const PivotFieldLink = connect(mapStateToProps, null)(PivotField)

module.exports = PivotFieldLink
