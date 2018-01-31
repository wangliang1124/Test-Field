const db = require('../lib/sequelize')
module.exports = db.defineModel('user_vip', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: db.STRING,
  no: db.STRING,
  start_time: {
    type: db.BIGINT.UNSIGNED
  },
  total_money: {
    type: db.BIGINT,
    get: function () {
      return this.getDataValue('total_money') / 100
    },
    set: function (val) {
      this.setDataValue('total_money', parseInt(val * 100))
    }
  },
  expire_time: {
    type: db.BIGINT.UNSIGNED
  },
  status: {
    type: db.ENUM,
    values: ['0', '1'],
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {status: '0', info: '失效'}
        case '1':
          return {status: '1', info: '有效'}
        default:
          return {status: '0', info: '失效'}
      }
    }
  },
  card_id: db.BIGINT.UNSIGNED,
  intro: {
    type: db.STRING,
    allowNull: true
  },
  user_id: db.BIGINT.UNSIGNED,
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
    attributes: ['id', 'name', 'no', 'start_time', 'card_id', 'expire_time', 'total_money', 'status', 'intro', 'user_id', 'created_at', 'updated_at']
  }
})
