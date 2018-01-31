import {System} from '../config/index'
const db = require('../lib/sequelize')
const Sequelize = require('sequelize')
module.exports = db.defineModel('specialty', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  collected: {
    type: db.BIGINT.UNSIGNED,
    defaultValue: 0
  },
  cover: {
    type: db.STRING,
    get: function () {
      if (this.getDataValue('cover') && this.getDataValue('cover').startsWith('http')) {
        return this.getDataValue('cover')
      } else {
        return `${System.HTTP_server_type}${System.HTTP_server_host}:${System.HTTP_server_port}${this.getDataValue('cover')}`
      }
    }
  },
  cook_avatar: {
    type: db.STRING,
    get: function () {
      if (this.getDataValue('cook_avatar') && this.getDataValue('cook_avatar').startsWith('http')) {
        return this.getDataValue('cook_avatar')
      } else {
        return `${System.HTTP_server_type}${System.HTTP_server_host}:${System.HTTP_server_port}${this.getDataValue('cook_avatar')}`
      }
    }
  },
  cook_intro: db.STRING,
  cook_name: db.STRING,
  cook_liked: {
    type: db.BIGINT.UNSIGNED,
    defaultValue: 0
  },
  cook_super: db.BOOLEAN,
  expire_time: db.BIGINT,
  intro: db.STRING,
  content_markdown_url: db.TEXT('long'),
  rule_markdown_url: db.TEXT('long'),
  shika_markdown_url: {
    type: db.TEXT('long'),
    allowNull: true
  },
  shitan_markdown_url: {
    type: db.TEXT('long'),
    allowNull: true
  },
  name: db.STRING,
  type: db.STRING,
  value: {
    type: db.BIGINT.UNSIGNED,
    set: function (val) {
      this.setDataValue('value', parseInt(val * 100))
    },
    get: function () {
      const price = this.getDataValue('value')
      return price / 100
    }
  },
  restaurant_id: db.BIGINT.UNSIGNED,
  created_at: db.BIGINT.UNSIGNED,
  updated_at: db.BIGINT.UNSIGNED,
  deleted_at: db.BIGINT.UNSIGNED,
  version: db.INTEGER.UNSIGNED,
  recommend_id: { // 新增字段recommend_id['restaurant_id1','restaurant_id2']用于添加推荐餐厅
    type: db.STRING
  }
}, {
  // defaultScope instance not be deleted
  defaultScope: {
    where: {
      deleted_at: null
    },
    attributes: ['id', 'cook_liked', 'collected', 'cover', 'cook_avatar', 'cook_name', 'cook_super', 'cook_intro', 'name', 'type', 'value', 'expire_time', 'intro', 'created_at', 'updated_at', 'restaurant_id', 'recommend_id'] // 新增字段recommend用于添加推荐餐厅
  },
  scopes: { // 暂时没用
    detail: {
      where: {
        deleted_at: null
      },
      attributes: ['id', 'cook_liked', 'collected', 'cover', 'name', 'type', 'value', 'cook_avatar', 'cook_intro', 'cook_name', 'cook_super', 'expire_time', 'intro', 'content_markdown_url', 'rule_markdown_url', 'shika_markdown_url', 'shitan_markdown_url', 'created_at', 'updated_at', 'restaurant_id', 'recommend_id']
    }
  }
})
