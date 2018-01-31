import {System} from '../config/index'
const db = require('../lib/sequelize')
module.exports = db.defineModel('specialty_img', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  specialty_id: db.INTEGER.UNSIGNED,  // 2017-11-16 新增
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
    attributes: ['id', 'specialty_id', 'url', 'alt', 'intro', 'created_at', 'updated_at']
  }
})
