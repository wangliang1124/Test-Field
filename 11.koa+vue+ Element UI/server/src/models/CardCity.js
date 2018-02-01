const db = require('../lib/sequelize')
module.exports = db.defineModel('card_city', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  card_id: db.INTEGER.UNSIGNED,
  area_id: db.INTEGER.UNSIGNED,
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
    attributes: ['id', 'card_id', 'area_id', 'created_at', 'updated_at']
  }
})
