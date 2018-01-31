const db = require('../lib/sequelize')
module.exports = db.defineModel('restaurant_scene', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  scene: db.STRING,
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
    attributes: ['id', 'scene', 'intro', 'created_at', 'updated_at']
  }
})
