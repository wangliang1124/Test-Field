const db = require('../lib/sequelize')
module.exports = db.defineModel('order_reserve', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: db.INTEGER.UNSIGNED,
    unique: true
  },
  restaurant_id: db.BIGINT.UNSIGNED,
  dining_date: db.BIGINT.UNSIGNED,
  count: db.INTEGER.UNSIGNED,
  room: db.STRING,
  user_id: db.BIGINT.UNSIGNED,
  user_name: {
    type: db.STRING,
    allowNull: true
  },
  tel: {
    type: db.STRING,
    allowNull: true
  },
  status: {
    type: db.ENUM,
    values: ['0', '1', '2'], // 0未支付 1已支付 2已失效
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {status: '0', info: '未预定'}
        case '1':
          return {status: '1', info: '预订成功'}
        case '2':
          return {status: '2', info: '预订失败'}
        default:
          return {status: '0', info: '未预定'}
      }
    }
  },
  remark: {
    type: db.STRING,
    allowNull: true
  },
  // created_at: db.BIGINT.UNSIGNED,
  // updated_at: db.BIGINT.UNSIGNED,
  deleted_at: db.BIGINT.UNSIGNED
  // version: db.INTEGER.UNSIGNED
}, {
  // defaultScope instance not be deleted
  defaultScope: {
    where: {
      deleted_at: null
    },
    attributes: ['id', 'order_id', 'restaurant_id', 'dining_date', 'count', 'room', 'user_id', 'user_name', 'tel', 'status', 'remark']
  }
})
