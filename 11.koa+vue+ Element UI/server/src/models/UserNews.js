const db = require('../lib/sequelize')
module.exports = db.defineModel('user_news', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: db.ENUM,
    values: ['0', '1'],
    defaultValue: '0', // 0未读 1已读
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {status: '0', info: '未读'}
        case '1':
          return {status: '1', info: '已读'}
        default:
          return {status: '0', info: '未读'}
      }
    }
  },
  title: db.STRING,
  content: db.STRING,
  url: db.STRING,
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
    attributes: ['id', 'status', 'title', 'content', 'url', 'user_id', 'created_at', 'updated_at']
  }
})
