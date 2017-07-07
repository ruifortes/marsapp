module.exports = {
  host: {
    ip: 'localhost',
    port: 3000
    // ip: '0.0.0.0',
    // port: 80
  },
  db: {
    client: 'mysql',
    connection: {
      host     : 'localhost',
        // user     : 'postgres',
        // password : 'rmrsf71',
      user     : 'mars',
      password : 'weather',
      database : 'marsweather'
    },
    debug: false
  },
  updateFrequence: [2,'minutes']
}
