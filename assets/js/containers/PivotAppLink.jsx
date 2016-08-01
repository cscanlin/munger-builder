import { connect } from 'react-redux'
import { setActiveName } from '../actions'
import PivotApp from '../components/PivotApp'

const mapDispatchToProps = (dispatch) => ({
  syncActiveName: (fieldId, activeName) => {
    dispatch(setActiveName(fieldId, activeName))
  },
})

const PivotAppLink = connect(null, mapDispatchToProps)(PivotApp)

module.exports = PivotAppLink
