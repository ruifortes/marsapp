var React = require('react')
  // , moment = require('moment')
  // , objectAssign = require('object-assign')
  // , touch = require('hammerjs')

var reportStore = require('../../stores/report_store.js')

var ReportNav = require('./report_nav.jsx')
var Report = require('./report.jsx')


module.exports = React.createClass({
  getInitialState: function() {
    return {
      report: undefined,
      dateStr: this.props.initialDateStr
    }
  },
  handle_storeChange: function (data) {
    this.setState(data)
  },

  componentWillReceiveProps: function (nextProps) {
    reportStore.getReport(nextProps.initialDateStr)
  },
  componentDidMount: function () {
    reportStore.on('change', this.handle_storeChange)
    reportStore.getReport(this.state.dateStr)
  },
  componentWillUnmount: function () {
    reportStore.removeListener('change', this.handle_storeChange)
  },
  render: function() {

    var rep = this.state.report

    return (
      <div className='report_view'>
        <ReportNav className='report_nav' rep={rep} date={this.state.dateStr}/>
        <Report className='report' report={rep}/>
      </div>
    )

  }

})
