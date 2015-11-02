var Promise = require('bluebird')
  , knex = require('./knexInstance.js')
  , request = require('request-promise')
  , util = require('util')
  , moment = require('moment')

var cfg = require('../config.js')

var theApi
var sockets

var Api = function (){

  this._lastDate

  this.getReportList = function (fromDate, toDate, page, pageLength) {
    page = page || 1
    pageLength = pageLength || 10

    var query = knex.select().from('reports')

    if (fromDate && toDate) {
      query.whereBetween('terrestrial_date',
        [fromDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD')]
      )
    } else if(fromDate){
      query.where('terrestrial_date', fromDate.format('YYYY-MM-DD'))
    }

    query.orderBy('terrestrial_date', 'desc')

    if(page > 0){
      query.offset((page-1) * pageLength).limit(pageLength)
    } else {
      query.limit(500)
    }

    return query
  }

  this.getReport = function (date) {

    var query = knex.select()
          .from('reports')
          .where('terrestrial_date', date.format('YYYY-MM-DD'))

    return query
  }

  this.getLastReportDate = function (){

    if(this._lastDate){
      return Promise.return(this._lastDate)
    } else {
      return knex('reports').max('terrestrial_date').then(function (rows) {
        if (rows.length > 0) {
          this._lastDate = moment.utc(rows[0].max)
          return this._lastDate
        } else {
          throw new Error('DB empty. Please reset with date')
        }
      })
    }
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
                    // return Promise.resolve(lastDate)
                    return lastDate
                  })

    }

    return waitForLastDate.then(function (startDate) {
      console.log('Fetch reports since ' + startDate.format('YYYY-MM-DD'))

      return new Promise(function (resolve, reject) {

        // recursive function to get each page of reports from api
        function _fetch(startDate, page){
          page = page || 1
          console.log(page > 1  ? 'Fetching page' + page : 'Fetching...')
          return request({
            uri: util.format('http://marsweather.ingenology.com/v1/archive/?terrestrial_date_start=%s&page=%d', startDate.format('YYYY-MM-DD'), page)
            , json: true
          })
          .then(function (data){

            results.push.apply(results, data.results)

            if(data.next){
              // there's more pages so lets recurse
              _fetch(startDate, page + 1)
            } else {
              // no more pages return
              if(!results.length) console.log('...nothing new')
              resolve(results)
            }

          })
          .catch(function (err){
            console.log('error fetching from api')
            reject(err)
          })

        }

        // start start with first page
        _fetch(startDate, 1)

      })
      .then(function (data) { //

        if(!data.length) return 0


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
                console.log('finish writing to DB')
                return data.length
              })
              .catch(function (err) {
                console.log('error writing to DB')
                return Promise.reject(err)
              })

      })

    })

  }

  this.fetchEvery = function (length, unit) { // ex: 2, 'minutes'

    var self = this

    function _fetchAndEmmit(){

      self.fetchReports().then(function (count) {
        self.getLastReportDate().then(function (lastDate) {
          sockets.emit('serverUpdated', {
            count: count,
            lastDate: lastDate.format('YYYY-MM-DD')
          })
        })
      })

    }

    _fetchAndEmmit()
    var timer = setInterval(function () {
      _fetchAndEmmit()
    }, moment.duration(length, unit).asMilliseconds())
  }

  this.resetDB = function (date) {

    var self = this

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

    }).then(function () {
      if(date.isValid()){
        return self.fetchReports(date)
      }
      return true
    })

  }

}



/**
 *  Add routes to app
 */

function addRoutes(api, router){

  router.get('/report/:date?', function (req, res) {

    var wait // wait for possible max data query
    var reqDate = !!req.params.date && moment(req.params.date)

    if (!reqDate) { // no date. get last report date

      wait = api.getLastReportDate().then(function (date) {
        if (date) {
          return date
        } else {
          return res.status(500).end()
        }
      })

    } else if(reqDate.isValid()){

      wait = Promise.resolve(reqDate)

    } else { // invalid date

      return res.status(400).end()

    }

    wait.then(function (date) {
      api.getReport(date).then(function (rows){
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


  router.get('/reports', function (req, res) {

    var fromDate = moment(req.query.from || null)
      , toDate = moment(req.query.to || null)
      , page = parseInt(req.query.page || 1)
      , pageLength = parseInt(req.query.pageLength || 10)

    if(req.query.from != null && !fromDate.isValid()) return res.status(404).send('invalid fromDate param')
    if(req.query.to != null && !toDate.isValid()) return res.status(404).send('invalid toDate param')
    if(isNaN(page)) return res.status(404).send('invalid page param')
    if(isNaN(pageLength)) return res.status(404).send('invalid page param')

    fromDate = fromDate.isValid() || undefined
    toDate = toDate.isValid() || undefined

    api.getReportList(fromDate, toDate, page, pageLength).then(function (rows){

      rows.map(function (report) {
        report.terrestrial_date = moment(report.terrestrial_date).format('YYYY-MM-DD')
      })

      return res.send(rows)

    }).catch(function (err) {
      return res.status(500).end()
    })

  })

}



// initialize Api as singleton and populate router
module.exports = function (router, io){

  // set global api var
  sockets = io.sockets

  if(theApi){
    return theApi
  } else if(router && io){

    var theApi = new Api()

    addRoutes(theApi, router)

    io.on('connection', function (socket) {
      theApi.getLastReportDate().then(function (lastDate) {
        socket.emit('serverUpdated', {
          count: null,
          lastDate: lastDate.format('YYYY-MM-DD')
        })
      })
    })

    console.log('Updating every ' + cfg.updateFrequence.join(' '));
    theApi.fetchEvery.apply(theApi, cfg.updateFrequence)
    return theApi
  } else {
    throw new Error("can't initialize initialize api without router")
  }

}
