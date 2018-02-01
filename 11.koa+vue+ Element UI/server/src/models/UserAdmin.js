const db = require('../lib/sequelize')
module.exports = db.defineModel('user_admin', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  phone: {
    type: db.BIGINT.UNSIGNED,
    unique: true
  },
  level: {
    type: db.INTEGER.UNSIGNED,
    defaultValue: 0
  },
  intro: {
    type: db.STRING
  },
  password: db.STRING,
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
    attributes: ['id', 'level', 'intro', 'phone', 'created_at', 'password', 'updated_at']
  }
})
