const db = require('../lib/sequelize')
module.exports = db.defineModel('restaurant_district', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  district: db.STRING,
  intro: {
    type: db.STRING,
    allowNull: true
  },
  restaurant_area_id: db.BIGINT.UNSIGNED,
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
    attributes: ['id', 'district', 'intro', 'restaurant_area_id', 'created_at', 'updated_at']
  }
})
