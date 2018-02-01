const db = require('../lib/sequelize')
module.exports = db.defineModel('card', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: db.STRING,
  cover: db.STRING,
  photos: db.STRING,
  price_unit: {
    type: db.BIGINT.UNSIGNED,
    set: function (val) {
      this.setDataValue('price_unit', parseInt(val * 100))
    },
    get: function () {
      const price = this.getDataValue('price_unit')
      return price / 100
    }
  },
  old_price: {
    type: db.INTEGER.UNSIGNED,
    allowNull: true
  },
  delivery: {
    type: db.INTEGER.UNSIGNED,
    allowNull: true
  },
  introduction: {
    type: db.TEXT('long'),
    allowNull: true
  },
  specification: {
    type: db.TEXT('long'),
    allowNull: true
  },
  expire_in: db.INTEGER.UNSIGNED,
  expire_time: {
    type: db.ENUM,
    values: ['hour', 'day', 'month', 'year'],
    defaultValue: 'day'
  },
  limit: db.INTEGER.UNSIGNED,
  intro: db.STRING,
  total_sold: {
    type: db.INTEGER.UNSIGNED,
    defaultValue: 0
  },
  created_at: db.BIGINT.UNSIGNED,
  updated_at: db.BIGINT.UNSIGNED,
  deleted_at: db.BIGINT.UNSIGNED,
  version: db.INTEGER.UNSIGNED,
  index: db.BIGINT.UNSIGNED,
  is_deleted: {
    type: db.BIGINT.UNSIGNED,
    allowNull: true
  }
}, {
  // defaultScope instance not be deleted
  defaultScope: {
    where: {
      deleted_at: null
    },
    attributes: ['id', 'name', 'cover', 'photos', 'price_unit', 'old_price', 'delivery', 'introduction', 'specification', 'expire_in', 'expire_time', 'limit', 'intro', 'total_sold', 'index', 'created_at', 'updated_at']
  }
})
