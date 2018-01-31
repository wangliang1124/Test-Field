const db = require('../lib/sequelize')
module.exports = db.defineModel('coupon_restaurant', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: db.STRING,
  value: {
    type: db.BIGINT.UNSIGNED,
    set: function (val) {
      this.setDataValue('value', parseInt(val * 100))
    },
    get: function () {
      const price = this.getDataValue('value')
      return price / 100
    }
  },
  status: {
    type: db.ENUM,
    values: ['0', '1', '2'], // 0 不可用 1可用 2已失效
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {status: '0', info: '不可用'}
        case '1':
          return {status: '1', info: '可用'}
        case '2':
          return {status: '2', info: '已失效'}
        default:
          return {status: '0', info: '不可用'}
      }
    }
  },
  restaurant_id: db.BIGINT.UNSIGNED,
  admin_id: {
    type: db.BIGINT.UNSIGNED,
    allowNull: true
  },
  user_id: db.BIGINT.UNSIGNED,
  intro: db.STRING,
  created_at: db.BIGINT.UNSIGNED,
  expire_at: db.BIGINT.UNSIGNED,
  updated_at: db.BIGINT.UNSIGNED,
  deleted_at: db.BIGINT.UNSIGNED,
  version: db.INTEGER.UNSIGNED
}, {
  // defaultScope instance not be deleted
  defaultScope: {
    where: {
      deleted_at: null
    },
    attributes: ['id', 'name', 'value', 'status', 'admin_id', 'user_id', 'restaurant_id', 'intro', 'created_at', 'updated_at', 'expire_at']
  }
})
