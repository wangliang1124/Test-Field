const db = require('../lib/sequelize')
module.exports = db.defineModel('specialty_record', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  specialty_id: db.BIGINT.UNSIGNED,
  user_id: db.BIGINT.UNSIGNED,
  money: {
    type: db.BIGINT.UNSIGNED,
    set: function (val) {
      this.setDataValue('money', parseInt(val * 100))
    },
    get: function () {
      const price = this.getDataValue('money')
      return price / 100
    }
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
    attributes: ['id', 'money', 'specialty_id', 'user_id', 'created_at', 'updated_at']
  }
})
