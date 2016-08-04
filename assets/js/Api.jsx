const $ = require('jquery')
const Cookie = require('js-cookie')
const update = require('react-addons-update')

class Api {
  async updateMunger(data, e) {
    if (e) {
      this.setState({ ...data })
      if (e.type === 'blur' || e.type === 'save') {
        const response = await fetch(`/script_builder/mungers/${this.props.mungerId}`, {
          credentials: 'same-origin',
          method: 'PUT',
          headers: this.csrfHeader,
          body: JSON.stringify({ ...data }),
        })
      }
    }
  }
}
module.exports = Api
