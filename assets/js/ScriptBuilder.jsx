const React = require('react')
const Immutable = require('immutable')
const Button = require('./Button')

class ScriptBuilder extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showFullScript: true,
    }
    this.toggleShowFullScript = this.toggleShowFullScript.bind(this)
  }

  toggleShowFullScript() {
    const showHide = !this.state.showFullScript
    this.setState({ showFullScript: showHide })
  }

  pythonStringify(object) {
    return JSON.stringify(object).replace(/[,:]/g, '$& ').replace(/"/g, '\'')
  }

  renameFieldMapString() {
    const renameFieldMap = {}
    this.props.data_fields.map(dataField => {
      if (dataField.new_name) {
        renameFieldMap[dataField.current_name] = dataField.new_name
      }
      return renameFieldMap
    })
    return this.pythonStringify(renameFieldMap)
  }

  indexFields() {
    return this.props.pivot_fields.filter(
      pivotField => pivotField.field_type === 1
    ).map(pivotField => `'${this.props.getActiveName(pivotField.data_field)}'`).join(', ')
  }

  columnFields() {
    return this.props.pivot_fields.filter(
      pivotField => pivotField.field_type === 2
    ).map(pivotField => `'${this.props.getActiveName(pivotField.data_field)}'`).join(', ')
  }

  aggregateNamesWithFunctions() {
    const aggregateFunctionsMap = {}
    this.props.pivot_fields.filter(
      pivotField => pivotField.field_type > 2
    ).map(pivotField => {
      const activeName = this.props.getActiveName(pivotField.data_field)
      if (!(activeName in aggregateFunctionsMap)) {
        aggregateFunctionsMap[activeName] = []
      }
      const fieldTypeFunction = this.props.getFieldTypeName(pivotField.field_type, true)
      return aggregateFunctionsMap[activeName].push(fieldTypeFunction)
    })
    return Immutable.Map(aggregateFunctionsMap)
  }

  formatAggregateFunctionsMap(aggregateFunctionsMap) {
    const indentString = '\n            '
    return `${indentString}${aggregateFunctionsMap.map(
      (value, key) => `'${key}': [${value.join(', ')}],`
    ).join(indentString)}\n        `
  }

  safeFileName() {
    return this.props.munger_name.replace(/ /g, '_').toLowerCase()
  }

  fullOutputPath() {
    if (!this.props.output_path) {
      let inputDir = this.props.input_path.substring(
        0, this.props.input_path.lastIndexOf('\\') + 1
      )
      if (inputDir !== '') {
        inputDir += '/'
      }
      return `${inputDir}${this.safeFileName()}-output.csv`
    }
    return this.props.output_path
  }

  scriptHead() {
    return (
    `import pandas as pd
    import numpy as np

    import os
    from datetime import datetime

    def print_run_status(run_start_time, message):
        print('\\n{0} - {1}'.format(datetime.now() - run_start_time, message))

    run_start_time = datetime.now()`.replace(/\n {4}/g, '\n'))
  }

  inputPath() {
    const inputPath = this.props.input_path || 'ADD INPUT FILE PATH HERE'
    return `\n\ninput_file = '${inputPath}'`
  }

  readCSV() {
    const printStatus = 'print_run_status(run_start_time, \'Reading Data From:' +
                        '\\n{0}\'.format(input_file))'
    let createDataFrame = ''
    if (this.props.rows_to_delete_top) {
      createDataFrame = `\ndf = pd.read_csv(input_file, skiprows=${this.props.rows_to_delete_top})`
    } else {
      createDataFrame = '\ndf = pd.read_csv(input_file)'
    }
    return `\n\n${printStatus}${createDataFrame}`
  }

  dropBottomRows() {
    if (this.props.rows_to_delete_bottom) {
      return `\n\ndf = df.drop(df.index[-${this.props.rows_to_delete_bottom}:])`
    }
    return ''
  }

  renameFields() {
    const renameString = this.renameFieldMapString()
    if (renameString !== '{}') {
      const sprintStatus = '\n\nprint_run_status(run_start_time, \'Renaming Fields...\')'
      const renameDataFrame = `\ndf = df.rename(columns=${renameString})`
      return sprintStatus + renameDataFrame
    }
    return ''
  }

  pivotTable() {
    const aggregateNamesWithFunctions = this.aggregateNamesWithFunctions()
    return `\n
    print_run_status(run_start_time, 'Building Pivot Table...')
    pivot_output = pd.pivot_table(
        df,
        index=[${this.indexFields()}],
        columns=[${this.columnFields()}],
        values=['${Array.from(aggregateNamesWithFunctions.keys()).join("', '")}'],
        aggfunc={${this.formatAggregateFunctionsMap(aggregateNamesWithFunctions)}},
        fill_value=0,
    )
    print(pivot_output)`.replace(/\n {4}/g, '\n')
  }


  writeFile() {
    return `\n
    print_run_status(run_start_time, 'Writing Output CSVs...')
    pivot_output.to_csv(os.path.abspath(r'${this.fullOutputPath()}'))

    print_run_status(run_start_time, 'Finished!')`.replace(/\n {4}/g, '\n')
  }

  fullScript() {
    return [this.scriptHead(),
            this.inputPath(),
            this.readCSV(),
            this.dropBottomRows(),
            this.renameFields(),
            this.pivotTable(),
            this.writeFile()].join('')
  }

  downloadLink() {
    return `data:text/plaincharset=utf-8,${encodeURIComponent(this.fullScript())}`
  }

  render() {
    return (
      <div className="script-builder-container">
        <Button
          type="button"
          value={this.state.showFullScript ? 'Show Pivot Only' : 'Show Full Script'}
          className="btn btn-primary toggle-show-pivot-only"
          onClick={this.toggleShowFullScript}
        />
        <a
          href={this.downloadLink()}
          download={`${this.safeFileName()}.py`}
          className="btn btn-primary"
        >
          Download Script
        </a>
        {this.state.showFullScript
          ? <pre>{this.fullScript()}</pre>
          : <pre>{this.pivotTable().replace('\n\n', '')}</pre>
        }
      </div>
    )
  }
}

ScriptBuilder.propTypes = {
  data_fields: React.PropTypes.array,
  pivot_fields: React.PropTypes.array,
  field_types: React.PropTypes.array,
  input_path: React.PropTypes.string,
  munger_name: React.PropTypes.string.isRequired,
  output_path: React.PropTypes.string,
  rows_to_delete_bottom: React.PropTypes.number,
  rows_to_delete_top: React.PropTypes.number,
  getActiveName: React.PropTypes.func.isRequired,
  getFieldTypeName: React.PropTypes.func.isRequired,
}
module.exports = ScriptBuilder

// print(pivot_output)
//
// print_run_status(run_start_time, 'Writing Output CSVs...')
// pivot_output.to_csv(os.path.abspath(r'{{ mb.get_output_path }}'))
//
// print_run_status(run_start_time, 'Finished!')
