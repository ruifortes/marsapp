module.exports = {
  host: {
    ip: 'localhost',
    port: 3000
  },
  db: {
    client: 'pg',
    connection: {
      host     : 'localhost',
      user     : 'mars',
      password : 'mars',
      database : 'marsWeather'
    },
    debug: false
  },
  updateFrequence: [2,'minutes']
}
