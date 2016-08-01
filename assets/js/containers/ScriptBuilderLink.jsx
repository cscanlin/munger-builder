import { connect } from 'react-redux'
import ScriptBuilder from '../components/ScriptBuilder'

const mapStateToProps = (state, ownProps) => ({
  activeNameMap: state.activeNameMap[ownProps.data_field],
})

const ScriptBuilderLink = connect(mapStateToProps, null)(ScriptBuilder)

module.exports = ScriptBuilderLink
