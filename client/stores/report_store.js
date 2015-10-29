var EventEmitter = require('events').EventEmitter
var request = require('reqwest')

var urlState = require('../urlState.js')

var ReportStore = function(){

  this.latestDate = null

  this.getReportList = function (page, pageLength) {
    var self = this
    pageLength = pageLength || 30

    return request({
      url: '/api/reports',
      data: {page: page, pageLength: pageLength}
    }).then(function (res) {

      self.emit('change' ,{
        reportList: res
      })

      return res

    })

  }

  this.getReport = function (dateStr){
    var self = this

    // urlState.set(null, dateStr)

    dateStr = dateStr || ''

    return request('/api/report/' + dateStr).then(function (res) {

      self.emit('change' ,{
        report: res,
        dateStr: dateStr
      })

    }).catch(function (err) {
      self.emit('change' ,{
        report: null,
        dateStr: dateStr
      })
    })

  }

}

ReportStore.prototype = new EventEmitter()

module.exports = new ReportStore()
