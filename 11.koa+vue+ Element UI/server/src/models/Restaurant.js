import {System} from '../config/index'
const db = require('../lib/sequelize')
module.exports = db.defineModel('restaurant', {
  id: {
    type: db.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  mapId: {
    type: db.STRING,
    unique: true
  },
  name: db.STRING,
  intro: {
    type: db.STRING,
    allowNull: true
  },
  cover: {
    type: db.STRING,
    get: function get () {
      if (this.getDataValue('cover') && this.getDataValue('cover').startsWith('http')) {
        return this.getDataValue('cover')
      } else {
        return `${System.HTTP_server_type}${System.HTTP_server_host}:${System.HTTP_server_port}${this.getDataValue('cover')}`
      }
    }
  },
  unit_average: {
    type: db.BIGINT.UNSIGNED,
    set: function (val) {
      this.setDataValue('unit_average', parseInt(val * 100))
    },
    get: function () {
      const price = this.getDataValue('unit_average')
      return price / 100
    }
  },
  icons: db.STRING,
  status: {
    type: db.ENUM,
    defaultValue: '1',
    values: ['0', '1', '2'], // 1 正常状态 0 停止服务  2 合约到期
    get: function () {
      switch (this.getDataValue('status')) {
        case '0':
          return {
            status: '0',
            info: '停止服务'
          }
        case '1':
          return {
            status: '1',
            info: '正常状态'
          }
        case '2':
          return {
            status: '2',
            info: '合约到期'
          }
        default:
          return {
            status: '1',
            info: '正常状态'
          }
      }
    }
  },
  tel: db.STRING,
  phone: {
    type: db.STRING,
    allowNull: true
  },
  address: db.STRING,
  location_x: db.FLOAT,
  location_y: db.FLOAT,
  score: db.FLOAT,  // 新增評分字段
  restaurant_scene_id: {
    type: db.BIGINT.UNSIGNED,
    allowNull: true
  },
  restaurant_other_id: {
    type: db.BIGINT.UNSIGNED,
    allowNull: true
  },
  restaurant_district_id: db.BIGINT.UNSIGNED,
  restaurant_cuisine_id: db.BIGINT.UNSIGNED,
  contract_time: db.BIGINT.UNSIGNED,
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
    attributes: ['id', 'mapId', 'name', 'intro', 'icons', 'status', 'cover', 'unit_average', 'tel', 'phone', 'address', 'location_x', 'location_y', 'score', 'restaurant_district_id', 'restaurant_cuisine_id', 'restaurant_scene_id', 'restaurant_other_id', 'contract_time', 'created_at', 'updated_at']
  },
  scopes: {
    idandName: {
      where: {
        deleted_at: null,
        status: 1
      },
      attributes: ['id', 'name', 'status']
    }
  }
})
