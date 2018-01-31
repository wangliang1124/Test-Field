const db = require('../lib/sequelize')
module.exports = db.defineModel('restaurant_tag', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  tag: db.STRING,
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
    attributes: ['id', 'tag', 'intro', 'created_at', 'updated_at']
  }
})
