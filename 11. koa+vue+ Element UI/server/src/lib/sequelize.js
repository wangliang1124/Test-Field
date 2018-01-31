import {DB as DBConfig} from '../config/'
const Sequelize = require('sequelize')
console.log('init sequelize...')
// Sequelize instance init
const sequelize = new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
  host: DBConfig.host,
  port: DBConfig.port,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false
})
// rewrite Sequelize.define, add some default options
function defineModel (name, attributes, options) {
  var attrs = {}
  for (let key in attributes) {
    let value = attributes[key]
    if (typeof value === 'object' && value['type']) {
      value.allowNull = value.allowNull || false
      attrs[key] = value
    } else {
      attrs[key] = {
        type: value,
        allowNull: false
      }
    }
  }

  attrs.created_at = {
    type: Sequelize.BIGINT,
    allowNull: false
  }
  attrs.updated_at = {
    type: Sequelize.BIGINT,
    allowNull: false
  }
  attrs.deleted_at = {
    type: Sequelize.BIGINT,
    allowNull: true
  }
  attrs.version = {
    type: Sequelize.BIGINT,
    allowNull: false
  }
  const defaultOptions = {
    tableName: name,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    hooks: {
      beforeValidate: function (obj) {
        const now = Date.now()
        if (obj.isNewRecord) {
          console.log('======================isNewRecord==================')
          obj.created_at = now
          obj.updated_at = now
          obj.version = 0
        } else {
          console.log('=====================更新update============================')
          obj.updated_at = now
        }
      }
    }
  }
  const overrideOptions = Object.assign({}, defaultOptions, options)
  overrideOptions.hooks.beforeValidate = defaultOptions.hooks.beforeValidate
  return sequelize.define(name, attrs, overrideOptions)
}

const TYPES = ['STRING', 'INTEGER', 'FLOAT', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN', 'DATE', 'DECIMAL', 'ENUM']

var exp = {
  defineModel: defineModel,
  sync: () => {
    // only allow create ddl in non-production environment:
    if (process.env.NODE_ENV !== 'production') {
      return sequelize.sync({ force: true })
    } else {
      throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.')
    }
  },
  sequelize: sequelize
}

for (let type of TYPES) {
  exp[type] = Sequelize[type]
}
module.exports = exp
