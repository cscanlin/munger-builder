const React = require('react');

class MainTable extends React.Component {

  render() {
    return (
      <div id="main-dropzone-container" className="main-dropzone-container clear">
        <div id="left-dropzone-container" className="left-dropzone-container">
          <div id="index-dropzone" className="dropzone index-dropzone">
            <span>Index Fields</span>
            <div id="indexList" type="index" className="index-dropzone">
            </div>
          </div>
        </div>
        <div id="right-dropzone-container" className="right-dropzone-container">
          <div id="column-dropzone" className="dropzone column-dropzone">
            <span>Column Fields</span>
            <div id="columnList" type="column" className="column-dropzone">
            </div>
          </div>
          <div id="agg-dropzone" className="dropzone agg-dropzone">
            <span>Aggregate Fields</span>
            <div id="aggList" type="agg" className="agg-dropzone">
            </div>
          </div>
        </div>
      </div>
    );
  }

}

module.exports = MainTable;
