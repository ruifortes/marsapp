var express = require('express')
  , fs      = require('fs')
  , jade    = require('jade')
  , Promise = require('bluebird')
  , moment = require('moment')

var argv = require('minimist')(process.argv.slice(2))
var app = module.exports = express()

// set up Jade
app.set('views', './views');
app.set('view engine', 'jade');

if(argv._.indexOf('local') >= 0){
  app.locals.ipAddress = 'localhost'
  app.locals.port      = 3000
} else {
  app.locals.ipAddress = '0.0.0.0'
  app.locals.port      = 80
}


//  get api instance and populate router to later add to the app
var apiRouter = express.Router()
var api = require('./server/api.js')(apiRouter)

app.use('/api', apiRouter)

app.use('/',  function(req, res) {

  // res.sendFile(__dirname + '/public/index.html')
  res.render('index', { content: 'TEST CONTENT' });

})

var waitFor = new Promise(function (resolve,reject) {
  if(argv.reset) {
    api.resetDB().then(function () {
      var date = moment(argv.reset, ["YYYY-MM-DD"])
      if(date.isValid()){
        api.fetchReports(date).then(function () {
          return resolve('Fetched reports since ' + date.format('YYYY-MM-DD'))
        })
      } else {
        return resolve('Reset to empty')
      }

    })
  } else {
    return resolve('nothing to do')
  }
})


waitFor.then(function (ret) {
  app.listen(app.locals.port, app.locals.ipAddress, function() {
    console.log('%s: Node server started on %s:%d ...',
    Date(Date.now() ), app.locals.ipAddress, app.locals.port)
  })
})
