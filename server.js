var express = require('express')
  , app = require('express')()
  , server = require('http').Server(app)
  , io = require('socket.io')(server)
  , fs      = require('fs')
  , jade    = require('jade')
  , Promise = require('bluebird')
  , moment  = require('moment')

var cfg = require('./config.js')


//validate args
var rawArgv = require('minimist')(process.argv.slice(2))

var validArgs = (function (argv) {

  argv.reset = argv.reset || process.env.reset

  if(argv.reset){
    argv.reset = moment.utc(argv.reset, ["YYYY-MM-DD"],true)
    if(!argv.reset.isValid()){
      console.log('Reset must be set to a vilid date string')
      return false
    }
  }

  return argv

})(JSON.parse(JSON.stringify(rawArgv)))

if(!validArgs) process.exit()


// set Express params
app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'))

//  api factory return api instance and populates router
var apiRouter = express.Router()
var api = require('./server/api.js')(apiRouter, io)

app.use('/api', apiRouter)

// moke it isomorphic
// require('node-jsx-babel').install()
// var React = require('react')
//   , ReactApp = React.createFactory(require('./client/app.jsx'))

// set base url
app.use('/',  function(req, res) {

  // var reactHtml = React.renderToString(ReactApp({}))

  // using jade to make this isomorphic later
  // res.render('index', { content: reactHtml})
  res.render('index', { content: 'reactHtml'})

})




//start server after reset
var waitForApiInitialization = new Promise(function (resolve, reject) {

  if (validArgs.reset) {
    api.resetDB(validArgs.reset).then(function () {
      resolve('Reset DB with reports since ' + validArgs.reset.format('YYYY-MM-DD'))
    }).catch(function (err) {
      reject(err)
    })
  } else {
    resolve('')
  }

  // if(validArgs.reset) {
  //   api.resetDB().then(function () {
  //     api.fetchReports(validArgs.reset).then(function () {
  //       return resolve('Reset DB with reports since ' + validArgs.reset.format('YYYY-MM-DD'))
  //     })
  //   })
  // } else {
  //   api.fetchReports().then(function () {
  //     return resolve('Fetched reports since ' + validArgs.reset.format('YYYY-MM-DD'))
  //   })
  // }

})


waitForApiInitialization.then(function (msg) {
  console.log(msg)

  server.listen(cfg.host.port, cfg.host.ip, function() {
    console.log('Node server listening on %s:%d ...', cfg.host.ip, cfg.host.port)
  })

}).catch(function (err) {
  console.log(err)
  process.exit()
})
