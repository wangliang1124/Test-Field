const env = process.env.NODE_ENV || 'development'

const Config = require(`./config-${env}.js`)
module.exports = Config
