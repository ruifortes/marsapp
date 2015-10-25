var React = require('react')
  , moment = require('moment')

var reportStore = require('./stores/report_store.js')

var ReportNav = require('./report_nav.jsx')

var _utils = require('./_utils.js')

module.exports = React.createClass({
  getInitialState: function() {
    return {
      report: null
    }
  },
  handle_storeChange: function (data) {

    this.setState(data)

  },
  handleKeyNavigation : function (evt) {

    var urlState = _utils._getUrlState()
    if (!urlState.viewParams) {
      urlState.viewParams = reportStore.latestDate
    }

    var date = moment(urlState.viewParams)
    
    if(!date.isValid()) return

    switch (evt.keyCode) {
      case 39: // arrow up
        urlState.viewParams = date.add(1, 'd').format('YYYY-MM-DD')
        break
      case 37: // arrow down
        urlState.viewParams = date.subtract(1, 'd').format('YYYY-MM-DD')
        break
      default:
        return
    }

    // _utils._setUrlState(null, urlState.viewParams)

    reportStore.getReport(urlState.viewParams)

  },
  componentWillReceiveProps: function (nextProps) {
    reportStore.getReport(nextProps.dateStr)
  },
  componentDidMount: function () {

    reportStore.on('change', this.handle_storeChange)
    reportStore.getReport(this.props.dateStr)

    // add arrow key navigation
    window.addEventListener('keyup', this.handleKeyNavigation)

  },
  componentWillUnmount: function () {

    reportStore.removeListener('change', this.handle_storeChange)
    window.removeEventListener('keyup', this.handleKeyNavigation)

  },
  render: function () {

    var rep = this.state.report

    if(!rep) return <div className='report'/>

    var items = Object.keys(rep).map(function (key) {
      return (
        <li>
          <span>{key}</span>
          <span>{rep[key]}</span>
        </li>
      )
    })

    return (
      <div className='report_view fillflex'>
        <ReportNav className='report_nav' date={rep.terrestrial_date}/>
        <div className='report'>
          <ul>{items}</ul>
        </div>
      </div>
    )

  }

})
