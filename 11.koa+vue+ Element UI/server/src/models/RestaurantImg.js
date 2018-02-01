import {System} from '../config/index'
const db = require('../lib/sequelize')
module.exports = db.defineModel('restaurant_img', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: db.STRING,
    get: function () {
      if (this.getDataValue('url').startsWith('http')) {
        return this.getDataValue('url')
      } else {
        return `${System.HTTP_server_type}${System.HTTP_server_host}:${System.HTTP_server_port}${this.getDataValue('url')}`
      }
    }
  },
  alt: db.STRING,
  intro: {
    type: db.STRING,
    allowNull: true
  },
  restaurant_id: db.BIGINT.UNSIGNED,
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
    attributes: ['id', 'url', 'alt', 'intro', 'restaurant_id', 'created_at', 'updated_at']
  }
})
