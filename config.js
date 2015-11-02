module.exports = {
  host: {
    ip: process.env.OPENSHIFT_NODEJS_IP,
    port: process.env.OPENSHIFT_NODEJS_PORT
  },
  db: {
    client: 'pg',
    connection: {
      host     : process.env.OPENSHIFT_POSTGRESQL_DB_HOST,
      user     : process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME,
      password : process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD,
      database : 'optylon'
    },
    debug: false
  },
  updateFrequence: [2,'minutes']
}
