const db = require('../lib/sequelize')
module.exports = db.defineModel('user_invite', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  inviter_id: db.BIGINT.UNSIGNED,
  user_id: db.BIGINT.UNSIGNED,
  status: {
    type: db.ENUM,
    values: ['0', '1', '2'], // 0 邀请注册 1 邀请成为会员 2 邀请奖励已发放
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {
            status: '0',
            info: '注册用户'
          }
        case '1':
          return {
            status: '1',
            info: '购买会员'
          }
        default:
          return {
            status: '0',
            info: '注册用户'
          }
      }
    }
  },
  prize_status: {
    type: db.ENUM,
    values: ['0', '1'], // 奖励状态 0 未发放 1已发放
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('prize_status')) {
        case '0':
          return {
            status: '0',
            info: '未发放'
          }
        case '1':
          return {
            status: '1',
            info: '已发放'
          }
        default:
          return {
            status: '0',
            info: '未发放'
          }
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
    attributes: ['id', 'inviter_id', 'user_id', 'status', 'prize_status', 'intro', 'created_at', 'updated_at']
  }
})
