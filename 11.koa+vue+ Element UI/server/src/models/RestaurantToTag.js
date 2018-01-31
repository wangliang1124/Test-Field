const db = require('../lib/sequelize')
module.exports = db.defineModel('restaurant_to_tag', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  restaurant_id: db.BIGINT.UNSIGNED,
  restaurant_tag_id: db.BIGINT.UNSIGNED,
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
    attributes: ['id', 'restaurant_id', 'restaurant_tag_id', 'created_at', 'updated_at']
  }
})
