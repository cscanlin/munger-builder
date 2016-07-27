const React = require('react');
const $ = require('jquery');
const Cookie = require('js-cookie');
const DataField = require('./DataField');
const FieldBank = require('./FieldBank');
const MainTable = require('./MainTable');
const PivotField = require('./PivotField');

class PivotApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFields: [],
      pivotFields: [],
      fieldTypes: [],
    };
    this.setState = this.setState.bind(this);
    this.addDataField = this.addDataField.bind(this);
    this.newFieldName = this.newFieldName.bind(this);
    this.deleteDataField = this.deleteDataField.bind(this);
    this.fieldTypeMap = this.fieldTypeMap.bind(this);
  }

  componentDidMount() {
    const source = `/script_builder/mungers/${this.props.mungerId}?format=json`;
    this.serverRequest = $.get(source, result => this.onMount(result));
    console.log(this.state.dataFields);
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  onMount(result) {
    this.setState({ dataFields: result.data_fields });
    this.setState({ pivotFields: result.pivot_fields });
    this.setState({ fieldTypes: result.field_types });
  }

  addDataField() {
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
      url: '/script_builder/data_fields/',
      data: newDataField,
      success: data => {
        this.setState({ dataFields: this.state.dataFields.concat([data]) });
      },
    });
    this.fieldTypeMap();
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

  deleteDataField(fieldID) {
    console.log('delete');
    const dataFields = this.state.dataFields;
    const deleteIndex = dataFields.findIndex(f => f.id === fieldID);
    dataFields.splice(deleteIndex, 1);
    $.ajax({
      beforeSend(jqXHR) {
        jqXHR.setRequestHeader('x-csrftoken', Cookie.get('csrftoken'));
      },
      type: 'DELETE',
      url: `/script_builder/data_fields/${fieldID}`,
      success: this.setState({ dataFields }),
    });
  }

  fieldTypeMap() {
    const fieldTypeMap = {};
    this.state.fieldTypes.reduce(fieldType => {
      fieldTypeMap[fieldType.id] = fieldType.type_name;
      console.log(fieldTypeMap);
      return fieldTypeMap;
    });
    console.log(fieldTypeMap);
  }

  render() {
    return (
      <div className="pivot-app">
        <FieldBank addDataField={this.addDataField}>
          {this.state.dataFields.map(dataField =>
            <DataField deleteDataField={this.deleteDataField} key={dataField.id} {...dataField} />
          )}
        </FieldBank>
        <MainTable>
          {this.state.pivotFields.map(pivotField =>
            <PivotField
              key={pivotField.id}
              fieldTypeMap={{ 3: 'count' }}
              active_name="abc"
              {...pivotField}
            />
          )}
        </MainTable>
      </div>
    );
  }
}


PivotApp.propTypes = {
  fields: React.PropTypes.array,
  mungerId: React.PropTypes.number.isRequired,
};
module.exports = PivotApp;
