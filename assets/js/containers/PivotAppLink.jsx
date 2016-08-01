import { connect } from 'react-redux'
import { setActiveName } from '../actions'
import PivotApp from '../components/PivotApp'

const mapStateToProps = (state) => ({
  data_fields: state.data_fields,
  pivot_fields: state.pivot_fields,
  field_types: state.field_types,
})


const mapDispatchToProps = (dispatch) => ({
  syncActiveName: (fieldId, activeName) => {
    dispatch(setActiveName(fieldId, activeName))
  },
})

const PivotAppLink = connect(mapStateToProps, mapDispatchToProps)(PivotApp)

module.exports = PivotAppLink
