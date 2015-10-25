var EventEmitter = require('events').EventEmitter
var request = require('reqwest')

var _setUrlState = require('../_utils.js')._setUrlState

var ReportStore = function(){

  this.latestDate = null

  this.getReportList = function (page) {
    var self = this

    return request({
      url: '/api/reports',
      data: {page: page},
    }).then(function (res) {

      self.emit('change' ,{
        reportList: res
      })

    })

  }

  this.getReport = function (dateStr){
    var self = this

    _setUrlState(null, dateStr)

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
