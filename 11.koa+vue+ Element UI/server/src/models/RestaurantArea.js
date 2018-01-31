const db = require('../lib/sequelize')
module.exports = db.defineModel('restaurant_area', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  city: db.STRING,
  province_code: db.STRING,
  location_x: db.FLOAT,
  location_y: db.FLOAT,
  intro: {
    type: db.STRING,
    allowNull: true
  },
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
    attributes: ['id', 'city', 'province_code', 'location_x', 'location_y', 'intro', 'created_at', 'updated_at']
  }
})
