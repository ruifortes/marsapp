var Promise = require('bluebird')
  , knex = require('./knexInstance.js')
  , request = require('request-promise')
  , util = require('util')
  , moment = require('moment')

var singleton

var Api = function (router){

  var minDate = new Date(2015, 1, 1)

  this.getReports = function (fromDate, toDate) {

    var query = knex.select().from('reports')

    if (toDate) {
      query.whereBetween('terrestrial_date', [fromDate, toDate])
    } else {
      query.where('terrestrial_date', fromDate.format('YYYY-MM-DD'))
    }

    return query
  }

  this.getLastReportDate = function (){

    return knex('reports').max('terrestrial_date').then(function (rows) {
      if (rows.length > 0) {
        return moment.utc(rows[0].max) //knex return local date object. don't parse as UTC
      } else {
        return false
      }
    })

  }

  this.fetchReports = function (startDate){

    var self = this

    var results = []

    var waitForLastDate

    if (startDate) {
      waitForLastDate = Promise.resolve(startDate)
    } else {
      waitForLastDate = this.getLastReportDate()
                  .then(function (lastDate) {
                    lastDate.add(1, 'd')
                    return Promise.resolve(lastDate)
                  })

    }

    return waitForLastDate.then(function (startDate) {

      return new Promise(function (resolve, reject) {

        function _fetch(startDate, page){
          console.log('Fetching page ' + page)
          return request({
            uri: util.format('http://marsweather.ingenology.com/v1/archive/?terrestrial_date_start=%s&page=%d', startDate.utc().format('YYYY-MM-DD'), page)
            , json: true
          })
          .then(function (data){

            results.push.apply(results, data.results)

            if(data.next){
              _fetch(startDate, page + 1)
            } else {
              resolve(results)
            }

          })
          .catch(function (err){
            reject(err)
          })

        }

        _fetch(startDate, 1)

      }).then(function (data) {
        // insert in DB
        var insertTasks = data.map(function (item) {
          var query = knex('reports').insert(item)

          // knex seams to wraps integer values in single quotes. Seams like a BUG
          // I'll just create the raw query string from knex object info.


          var rawQuery = query.toSQL().sql

          query.toSQL().bindings.forEach(function (val){
            if(val == null){
              rawQuery = rawQuery.replace("?", "NULL")
            } else if(typeof val === "string") {
              rawQuery = rawQuery.replace("?", "'" + val + "'")
            } else {
              rawQuery = rawQuery.replace("?", val)
            }
          })

          return knex.raw(rawQuery)

        })

        return Promise.all(insertTasks)
              .then(function (ret) {
                console.log('Finish inserting')
              })
              .catch(function (err) {
                console.log(err)
              })

      })

    })
    .catch(function (err) {
      return Promise.reject("Can't fetch without date nor previous report")
    })

  }

  this.resetDB = function () {

    return knex.schema.dropTableIfExists('reports').then(function (ret){

      return knex.schema.createTable('reports', function (table) {
        table.increments()
        table.string('terrestrial_date').index()
        table.integer('sol')
        table.integer('ls')
        table.integer('min_temp')
        table.integer('min_temp_fahrenheit')
        table.integer('max_temp')
        table.integer('max_temp_fahrenheit')
        table.integer('pressure')
        table.string('pressure_string')
        table.integer('abs_humidity')
        table.integer('wind_speed')
        table.string('wind_direction')
        table.string('atmo_opacity')
        table.string('season')
        table.string('sunrise')
        table.string('sunset')
      })

    })



  }

}



/**
 *  Add routes to app
 */

function addRoutes(api, router){

  router.get('/report/:date?', function (req, res) {

    var wait // wait for possible max data query
    var reqDate = !!req.params.date && moment.utc(req.params.date)

    if (!reqDate) { // no date. get last report date
      wait = api.getLastReportDate().then(function (date) {
        if (date) {
          return date
        } else {
          return res.status(500).end()
        }
      })

    } else if(!reqDate.isValid()){ // invalid date

      return res.status(400).end()

    } else {

      wait = Promise.resolve(reqDate)

    }

    wait.then(function (date) {
      api.getReports(date).then(function (rows){
        if(rows.length > 0){
          var report = rows[0]
          //change terrestrial_date formated string
          report.terrestrial_date = moment(report.terrestrial_date).format('YYYY-MM-DD')
          return res.send(report)
        } else {
          return res.status(404).end()
        }
      })
    }).catch(function (err) {
      return res.status(500).end()
    })

  })


}

module.exports = function (router){
  if(singleton){
    return singleton
  } else if(router){
    var singleton = new Api(router)
    addRoutes(singleton, router)
    return singleton
  } else {
    throw new Error("can't initialize initialize api without router")
  }

}
