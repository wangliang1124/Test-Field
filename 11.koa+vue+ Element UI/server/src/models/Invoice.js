const db = require('../lib/sequelize')
module.exports = db.defineModel('invoice', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  no: db.BIGINT.UNSIGNED,
  title: {
    type: db.STRING,
    allowNull: true
  },
  money: db.BIGINT.UNSIGNED,
  content: {
    type: db.STRING,
    allowNull: true
  },
  tax_code: {
    type: db.STRING,
    allowNull: true
  },
  transfor_code: {
    type: db.STRING,
    allowNull: true
  },
  type: {
    type: db.ENUM,
    values: ['0', '1'], // 0 个人 1 公司
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('type')) {
        case '0':
          return {status: '0', info: '个人'}
        case '1':
          return {status: '1', info: '单位'}
        default:
          return {status: '0', info: '个人'}
      }
    }
  },
  status: {
    type: db.ENUM,
    values: ['0', '1', '2'], // 0 未开 1 已开 2 已拒绝
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {status: '0', info: '未开'}
        case '1':
          return {status: '1', info: '已开'}
        case '2':
          return {status: '2', info: '已拒绝'}
        default:
          return {status: '0', info: '未支付'}
      }
    }
  },
  user_id: db.BIGINT.UNSIGNED,
  order_id: {
    type: db.BIGINT.UNSIGNED,
    allowNull: true
  },
  order_group_id: {
    type: db.BIGINT.UNSIGNED,
    allowNull: true
  },
  transfor_status: {
    type: db.ENUM,
    values: ['0', '1'], // 0 未寄出 1 已寄出
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {status: '0', info: '未开'}
        case '1':
          return {status: '1', info: '已开'}
        default:
          return {status: '0', info: '未支付'}
      }
    }
  },
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
    attributes: ['id', 'no', 'title', 'money', 'content', 'tax_code', 'user_id', 'order_id', 'order_group_id', 'transfor_code', 'type', 'status', 'transfor_status', 'intro', 'created_at', 'updated_at', 'deleted_at']
  }
})
