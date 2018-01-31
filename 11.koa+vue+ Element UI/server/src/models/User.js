const db = require('../lib/sequelize')
module.exports = db.defineModel('user', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  wx_openid: {
    type: db.STRING,
    unique: true
  },
  avatar: db.STRING,
  nickname: db.STRING,
  age: {
    type: db.BIGINT.UNSIGNED,
    defaultValue: 0
  },
  sex: {
    type: db.ENUM,
    values: ['0', '1', '2'],
    defaultValue: '0',
    get: function () {
      switch (this.getDataValue('sex')) {
        case '0':
          return {sex: '0', info: '未知'}
        case '1':
          return {sex: '1', info: '男'}
        case '2':
          return {sex: '2', info: '女'}
        default :
          return {sex: '0', info: '未知'}
      }
    }
  },
  job: {
    type: db.STRING,
    allowNull: true
  },
  province: {
    type: db.STRING,
    allowNull: true
  },
  city: {
    type: db.STRING,
    allowNull: true
  },
  country: {
    type: db.STRING,
    allowNull: true
  },
  phone: {
    type: db.BIGINT.UNSIGNED,
    unique: true,
    allowNull: true
  },
  password: db.STRING,
  last_login: db.BIGINT.UNSIGNED,
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
    attributes: ['id', 'wx_openid', 'job', 'age', 'avatar', 'nickname', 'sex', 'province', 'city', 'country', 'phone', 'created_at', 'updated_at', 'last_login']
  }
})
