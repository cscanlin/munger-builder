const React = require('react');
const $ = require('jquery');
const Cookie = require('js-cookie');
const DataField = require('./DataField');
const FieldBank = require('./FieldBank');
const MainTable = require('./MainTable');

class PivotApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
    };
    this.addField = this.addField.bind(this);
    this.newFieldName = this.newFieldName.bind(this);
    this.deleteField = this.deleteField.bind(this);
  }

  componentDidMount() {
    const source = `/script_builder/munger/${this.props.mungerId}?format=json`;
    this.serverRequest = $.get(source, result =>
      this.setState({ fields: result.data_fields })
    );
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  addField() {
    console.log('add field');
    const field = {
      munger_builder: this.props.mungerId,
      current_name: this.newFieldName(),
    };
    const fields = this.state.fields;
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'));
      },
      type: 'POST',
      url: '/script_builder/field/create',
      data: field,
      success: data => {
        fields.push(data);
        this.setState(fields);
      },
    });
  }

  newFieldName() {
    // TODO Will not update if fields have changed without reloading
    let numNewFields = this.state.fields.filter(item =>
      item.active_name.startsWith('New Field')
    ).length;
    if (numNewFields > 0) {
      numNewFields += 1;
      return `New Field ${numNewFields}`;
    }
    return 'New Field';
  }

  deleteField(fieldID) {
    const fields = this.state.fields;

    const deleteIndex = fields.findIndex(f => f.id === fieldID);
    fields.splice(deleteIndex, 1);

    console.log('delete');
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'));
      },
      type: 'DELETE',
      url: `/script_builder/field/${fieldID}`,
      success: this.setState(fields),
    });
  }

  render() {
    return (
      <div className="pivot-app">
        <FieldBank addField={this.addField}>
          {this.state.fields.map(field =>
            <DataField deleteField={this.deleteField} key={field.id} {...field} />
          )}
        </FieldBank>
        <MainTable />
      </div>
    );
  }
}

PivotApp.propTypes = {
  fields: React.PropTypes.array,
  mungerId: React.PropTypes.number.isRequired,
};
module.exports = PivotApp;
