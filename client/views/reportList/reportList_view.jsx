var React = require('react')

var reportStore = require('../../stores/report_store.js')

var AutoLoadList = require('../../components/autoLoadList.jsx')
var ReportList = require('./reportList.jsx')


module.exports = React.createClass({
  _lastPage: 1,
  getInitialState: function() {
    return {
      reportList: []
    }
  },
  handle_storeChange: function (data) {
    var newList = this.state.reportList.concat(data.reportList)
    this.setState({reportList: newList})
  },
  loadMore: function (callback) {
    console.log('fetching page ' + (this._lastPage + 1))
    reportStore.getReportList(this._lastPage + 1, 30).then(function (result) {
      if(result.length){
        this._lastPage += 1
      }
      console.log('got page ' + this._lastPage)

      // return true is it's last page to disable autoload
      callback(!result.length)

    }.bind(this))
  },
  componentDidMount: function () {
    reportStore.on('change', this.handle_storeChange)
    reportStore.getReportList(1, 30)
  },
  componentWillUnmount: function () {
    reportStore.removeListener('change', this.handle_storeChange)
  },
  render: function () {

    return (
      <AutoLoadList className='reportList' onLoadMore={this.loadMore}>
        <ReportList reportList={this.state.reportList}/>
      </AutoLoadList>
    )

  }

})
