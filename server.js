var express = require('express')
  , app = require('express')()
  , server = require('http').Server(app)
  , io = require('socket.io')(server)
  , fs      = require('fs')
  , jade    = require('jade')
  , Promise = require('bluebird')
  , moment  = require('moment')


var argv = require('minimist')(process.argv.slice(2))

//  api factory return api instance and populates router
var apiRouter = express.Router()
var api = require('./server/api.js')(apiRouter, io)

// var app = express()

app.locals.ipAddress = 'localhost'
app.locals.port = 3000

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))

app.use('/api', apiRouter)

app.use('/',  function(req, res) {
  // using jade to make this isomorphic later
  res.render('index', { content: 'TEST CONTENT' })

})

//start server after reset
var waitForReset = new Promise(function (resolve,reject) {
  var reset = argv.reset || process.env.reset
  if(reset) {
    api.resetDB().then(function () {
      var date = moment.utc(reset, ["YYYY-MM-DD"])
      if(date.isValid()){
        api.fetchReports(date).then(function () {
          return resolve('Reset DB with reports since ' + date.format('YYYY-MM-DD'))
        })
      } else {
        return resolve('Reset to empty DB')
      }

    })
  } else {
    return resolve()
  }
})


waitForReset.then(function (msg) {
  console.log(msg)

  // app.listen(app.locals.port, app.locals.ipAddress, function() {
  //   console.log('%s: Node server started on %s:%d ...',
  //   Date(Date.now() ), app.locals.ipAddress, app.locals.port)
  // })

  server.listen(app.locals.port, app.locals.ipAddress, function() {
    console.log('%s: Node server started on %s:%d ...',
    Date(Date.now() ), app.locals.ipAddress, app.locals.port)
  })

})
