var EventEmitter = require('events').EventEmitter
var request = require('reqwest')

var ReportStore = function(){

  this.latestDate = null

  this.getReportList = function (page, pageLength) {
    var self = this
    pageLength = pageLength || 30

    return request({
      url: '/api/reports',
      data: {page: page, pageLength: pageLength}
    }).then(function (res) {

      var result = {
        reportList: res
      }
      
      self.emit('change' , result)

      return result

    })

  }

  this.getReport = function (dateStr){
    var self = this

    dateStr = dateStr || ''

    return request('/api/report/' + dateStr).then(function (res) {

      var result = {
        report: res,
        dateStr: dateStr || res.terrestrial_date
      }

      self.emit('change', result)

      return result

    }).catch(function (err) {

      var result = {
        report: null,
        dateStr: dateStr || res.terrestrial_date
      }

      self.emit('change' ,result)

      return result
    })

  }

}

ReportStore.prototype = new EventEmitter()

module.exports = new ReportStore()
