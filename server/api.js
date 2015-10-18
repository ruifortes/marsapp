var Promise = require('bluebird')
  , knex = require('./knexInstance.js')
  , request = require('request-promise')
  , util = require('util')
  , moment = require('moment')

var singleton

var Api = function(router){

  var minDate = new Date(2015, 1, 1)

  this.getLastReportDate = function(){
    var lastDate = moment(new Date('2015-8-1'))
    return Promise.resolve(lastDate)

    // return knex('reports').max('terrestrial_date').then(function (maxDate) {
    //   if (maxDate) {
    //     return moment(maxDate)
    //   } else {
    //     return moment('2015-8-1')
    //   }
    // })

  }

  this.fetchReports = function(startDate){

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
            uri: util.format('http://marsweather.ingenology.com/v1/archive/?terrestrial_date_start=%s&page=%d', startDate.format('YYYY-MM-DD'), page)
            , json: true
          })
          .then(function(data){

            results.push.apply(results, data.results)

            if(data.next){
              _fetch(startDate, page + 1)
            } else {
              resolve(results)
            }

          })
          .catch(function(err){
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

          query.toSQL().bindings.forEach(function(val){
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
                console.log(ret);
              })
              .catch(function (err) {
                console.log(err);
              })

      })

    })
    .catch(function (err) {
      return Promise.reject("Can't fetch without date nor previous report")
    })

  }

  this.resetDB = function () {

    return knex.schema.dropTableIfExists('reports').then(function(ret){

      return knex.schema.createTable('reports', function (table) {
        table.increments()
        table.string('terrestrial_date')
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
      }).then(function (something) {
        return 'Finish DB reset'
      })

    })



  }


}

/**
 *  Add routes to app
 */
function addRoutes(api, router){

  router.get('/report/test', function(req, res) {

//     api.resetDB().then(function (data) {
//       console.log(data);
//     })

    api.fetchReports(moment(new Date('2015-10-10'))).then(function(data){
      console.log('Finish fetching')
    }).
    catch(function(err){
      console.log(err)
    })

  })

  router.get('/report/:id?', function(req, res) {

    if (req.params.id != null) {
      res.send({id:req.params.id})
    } else {
      res.status(404).end()
    }

  })


}


module.exports = function(router){
  if(singleton){
    return singleton
  } else if(router){
    var api = new Api(router)
    addRoutes(api, router);
  } else {
    throw new Error("can't initialize initialize api without router")
  }

  return api;
}
