var cfg = require('../config.js').db

module.exports = require('knex')(cfg)
