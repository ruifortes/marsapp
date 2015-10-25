module.exports = require('knex')({
  client: 'pg',
  connection: {
    host     : 'localhost',
    // host: 'rsf.ydns.eu',
    user     : 'postgres',
    password : 'rmrsf71',
    database : 'marsWeather'
  },
  debug: false
})
