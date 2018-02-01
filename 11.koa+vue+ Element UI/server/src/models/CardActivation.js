const db = require('../lib/sequelize')
module.exports = db.defineModel('card_activation', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: db.STRING,
    unique: true
  },
  expire_time: db.BIGINT.UNSIGNED,
  card_id: db.BIGINT,
  status: {
    type: db.ENUM,
    values: ['0', '1', '2'],
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {status: '0', info: '未激活'}
        case '1':
          return {status: '1', info: '已激活'}
        case '2':
          return {status: '2', info: '已失效'}
        default:
          return {status: '0', info: '未激活'}
      }
    }
  },
  admin_id: db.BIGINT.UNSIGNED,
  intro: {
    type: db.STRING,
    allowNull: true
  },
  actived_at: {
    type: db.BIGINT.UNSIGNED,
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
    attributes: ['id', 'code', 'card_id', 'status', 'admin_id', 'intro', 'actived_at', 'created_at', 'updated_at']
  }
})
