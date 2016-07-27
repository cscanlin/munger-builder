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
      dataFields: [],
    };
    this.addField = this.addField.bind(this);
    this.newFieldName = this.newFieldName.bind(this);
    this.deleteField = this.deleteField.bind(this);
  }

  componentDidMount() {
    const source = `/script_builder/munger/${this.props.mungerId}?format=json`;
    this.serverRequest = $.get(source, result =>
      this.setState({ dataFields: result.data_fields })
    );
    console.log(this.state.dataFields);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  addField() {
    console.log('add field');
    const newDataField = {
      munger_builder: this.props.mungerId,
      current_name: this.newFieldName(),
    };
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'));
      },
      type: 'POST',
      url: '/script_builder/field/create',
      data: newDataField,
      success: data => {
        this.setState({ dataFields: this.state.dataFields.concat([data]) });
      },
    });
  }

  newFieldName() {
    // TODO Will not update if fields have changed without reloading
    let numNewFields = this.state.dataFields.filter(item =>
      item.active_name.startsWith('New Field')
    ).length;
    if (numNewFields > 0) {
      numNewFields += 1;
      return `New Field ${numNewFields}`;
    }
    return 'New Field';
  }

  deleteField(fieldID) {
    console.log('delete');
    const dataFields = this.state.dataFields;
    const deleteIndex = dataFields.findIndex(f => f.id === fieldID);
    dataFields.splice(deleteIndex, 1);
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'));
      },
      type: 'DELETE',
      url: `/script_builder/field/${fieldID}`,
      success: this.setState({ dataFields }),
    });
  }

  render() {
    return (
      <div className="pivot-app">
        <FieldBank addField={this.addField}>
          {this.state.dataFields.map(dataField =>
            <DataField deleteField={this.deleteField} key={dataField.id} {...dataField} />
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
