const db = require('../lib/sequelize')
module.exports = db.defineModel('card_to_tag', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  card_id: {
    type: db.STRING,
    unique: false
  },
  tag_id: {
    type: db.BIGINT.UNSIGNED,
    unique: false
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
    attributes: ['id', 'card_id', 'tag_id', 'created_at', 'updated_at']
  }
})
