const db = require('../lib/sequelize')
module.exports = db.defineModel('system_config', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  ACTIVATION_expireIn: db.BIGINT.UNSIGNED, // 激活码有效时长
  JWT_expiresIn: db.BIGINT.UNSIGNED, // 自动登录有效时长
  INVITE_money: { // 邀请发送代金券金额
    type: db.BIGINT.UNSIGNED,
    set: function (val) {
      this.setDataValue('INVITE_money', parseInt(val * 100))
    },
    get: function () {
      const price = this.getDataValue('INVITE_money')
      return price / 100
    }
  },
  allowTax: db.BIGINT.UNSIGNED,
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
    attributes: ['id', 'ACTIVATION_expireIn', 'JWT_expiresIn', 'allowTax', 'INVITE_money', 'created_at', 'updated_at']
  }
})
