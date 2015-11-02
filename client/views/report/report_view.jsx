var React = require('react')
  // , moment = require('moment')
  // , objectAssign = require('object-assign')
  // , touch = require('hammerjs')

var {History} = require('react-router')

var reportStore = require('../../stores/report_store.js')

var ReportNav = require('./report_nav.jsx')
var Report = require('./report.jsx')


module.exports = React.createClass({
  mixins: [ History ],

  getInitialState: function() {
    return {
      report: undefined,
      dateStr: this.props.params.date
    }
  },
  handle_storeChange: function (data) {
    this.setState(data)
  },

  componentWillReceiveProps: function (nextProps) {
    reportStore.getReport(nextProps.params.date)
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
        <ReportNav className='report_nav' rep={rep} dateStr={this.state.dateStr}/>
        <Report className='report' report={rep}/>
      </div>
    )

  }

})
