const db = require('../lib/sequelize')
module.exports = db.defineModel('restaurant_opentime', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  info: db.STRING,
  time_range: db.STRING,
  restaurant_id: db.BIGINT.UNSIGNED,
  created_at: db.BIGINT.UNSIGNED,
  updated_at: db.BIGINT.UNSIGNED,
  deleted_at: db.BIGINT.UNSIGNED,
  version: db.INTEGER.UNSIGNED
}, {
  // defaultScope instance not be deleted
  defaultScope: {
    where: {
      deleted_at: null
    },
    attributes: ['id', 'info', 'time_range', 'restaurant_id', 'created_at', 'updated_at']
  }
})
