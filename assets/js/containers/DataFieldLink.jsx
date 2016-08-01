import { connect } from 'react-redux'
import { setActiveName } from '../actions'
import DataField from '../components/DataField'

const mapDispatchToProps = (dispatch) => ({
  syncActiveName: (fieldId, activeName) => {
    dispatch(setActiveName(fieldId, activeName))
  },
})

const DataFieldLink = connect(null, mapDispatchToProps)(DataField)

module.exports = DataFieldLink
