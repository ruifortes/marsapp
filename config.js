module.exports = {
  host: {
    ip: 'localhost',
    port: 3000
    // ip: '0.0.0.0',
    // port: 80
  },
  db: {
    client: 'pg',
    connection: {
      host     : 'localhost',
        // user     : 'postgres',
        // password : 'rmrsf71',
      user     : 'mars',
      password : 'mars',
      database : 'marsWeather'
    },
    debug: false
  },
  updateFrequence: [2,'minutes']
}
