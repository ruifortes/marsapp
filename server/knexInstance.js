module.exports = require('knex')({
  client: 'pg',
  connection: {
    host     : 'localhost',
    user     : 'mars',
    password : 'mars',
    database : 'marsWeather'
  },
  debug: false
})
