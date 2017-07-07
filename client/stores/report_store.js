var EventEmitter = require('events').EventEmitter
var querystring = require('querystring')

require('isomorphic-fetch')


function _queryStr(obj){
  var str = querystring.stringify(obj)
  return !!str ? '?' + str : ''
}

var ReportStore = function(){

  this.latestDate = null

  this.getReportList = function (page, pageLength) {
    var self = this
    pageLength = pageLength || 30

    return fetch('/api/reports' + _queryStr({page: page, pageLength: pageLength}))
      .then( response =>
        response.json().then( json => ({ json, response }))
      ).then( ({ json, response }) => {

        if (!response.ok) {
          return Promise.reject(json)
        }

        var result = {reportList: json}
        self.emit('change' , result)
        return result

      }).catch( err => console.log('parsing failed', err) )

  }

  this.getReport = function (dateStr){
    var self = this

    dateStr = dateStr || ''

    return fetch('/api/report/' + dateStr)
      .then( response => {

        if (!response.ok) {
          return Promise.resolve({json:null, response})
        }

        return response.json().then( json => ({json, response}) )

      }).then( ({json, response}) => {

        var result = {
          report: json,
          dateStr: dateStr || json.terrestrial_date
        }

        self.emit('change', result)
        return result

      }).catch( err => console.log('parsing failed', err) )

  }

}

ReportStore.prototype = new EventEmitter()

module.exports = new ReportStore()
