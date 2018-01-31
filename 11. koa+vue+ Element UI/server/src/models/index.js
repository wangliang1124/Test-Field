const fs = require('fs')
const db = require('../lib/sequelize')
const path = require('path')
const files = fs.readdirSync(__dirname)

let jsFiles = files.filter((f) => {
  return f.endsWith('.js') && f !== 'index.js'
}, files)

let models = {}

for (let f of jsFiles) {
  console.log(`import model from file ${f}...`)
  const name = f.substring(0, f.length - 3)
  models[name] = require(path.join(__dirname, f))
}
// model Associations
models['User'].hasMany(models['UserVip'], {foreignKey: 'user_id', constraints: false})
models['UserVip'].belongsTo(models['User'], {foreignKey: 'user_id', constraints: false})

models['Card'].hasOne(models['UserVip'], {foreignKey: 'card_id', constraints: false})
models['UserVip'].belongsTo(models['Card'], {foreignKey: 'card_id', constraints: false})

models['Card'].belongsToMany(models['CardTag'], {through: models['CardToTag'], constraints: false, foreignKey: 'card_id'})
models['CardTag'].belongsToMany(models['Card'], {through: models['CardToTag'], constraints: false, foreignKey: 'tag_id'})

models['Restaurant'].belongsToMany(models['RestaurantTag'], {through: models['RestaurantToTag'], constraints: false, foreignKey: 'restaurant_id'})
models['RestaurantTag'].belongsToMany(models['Restaurant'], {through: models['RestaurantToTag'], constraints: false, foreignKey: 'restaurant_tag_id'})

models['Restaurant'].hasMany(models['RestaurantImg'], {foreignKey: 'restaurant_id', constraints: false})
models['RestaurantImg'].belongsTo(models['Restaurant'], {foreignKey: 'restaurant_id', constraints: false})

models['Restaurant'].hasMany(models['RestaurantOpentime'], {foreignKey: 'restaurant_id', constraints: false})
models['RestaurantOpentime'].belongsTo(models['Restaurant'], {foreignKey: 'restaurant_id', constraints: false})

models['Restaurant'].belongsTo(models['RestaurantArea'], {foreignKey: 'restaurant_area_id', constraints: false})
models['RestaurantArea'].hasMany(models['Restaurant'], {foreignKey: 'restaurant_area_id', constraints: false})

models['Restaurant'].belongsTo(models['RestaurantDistrict'], {foreignKey: 'restaurant_district_id', constraints: false})
models['RestaurantDistrict'].hasMany(models['Restaurant'], {foreignKey: 'restaurant_district_id', constraints: false})

models['Restaurant'].belongsTo(models['RestaurantCuisine'], {foreignKey: 'restaurant_cuisine_id', constraints: false})
models['RestaurantCuisine'].hasMany(models['Restaurant'], {foreignKey: 'restaurant_cuisine_id', constraints: false})

models['User'].hasMany(models['UserInvite'], {foreignKey: 'inviter_id', constraints: false})
models['UserInvite'].belongsTo(models['User'], {foreignKey: 'inviter_id', constraints: false})

models['User'].hasMany(models['Order'], {foreignKey: 'user_id', constraints: false})
models['Order'].belongsTo(models['User'], {foreignKey: 'user_id', constraints: false})

models['User'].hasMany(models['OrderGroup'], {foreignKey: 'user_id', constraints: false})
models['OrderGroup'].belongsTo(models['User'], {foreignKey: 'user_id', constraints: false})

models['RestaurantArea'].hasMany(models['RestaurantDistrict'], {foreignKey: 'restaurant_area_id', constraints: false})
models['RestaurantDistrict'].belongsTo(models['RestaurantArea'], {foreignKey: 'restaurant_area_id', constraints: false})

models['Card'].hasMany(models['Order'], {foreignKey: 'card_id', constraints: false})
models['Order'].belongsTo(models['Card'], {foreignKey: 'card_id', constraints: false})

models['Card'].hasMany(models['OrderGroup'], {foreignKey: 'card_id', constraints: false})
models['OrderGroup'].belongsTo(models['Card'], {foreignKey: 'card_id', constraints: false})

models['Restaurant'].hasMany(models['Specialty'], {foreignKey: 'restaurant_id', constraints: false})
models['Specialty'].belongsTo(models['Restaurant'], {foreignKey: 'restaurant_id', constraints: false})

models['User'].hasMany(models['SpecialtyLiked'], {foreignKey: 'user_id', constraints: false})
models['SpecialtyLiked'].belongsTo(models['User'], {foreignKey: 'user_id', constraints: false})

models['User'].hasMany(models['SpecialtyCollected'], {foreignKey: 'user_id', constraints: false})
models['SpecialtyCollected'].belongsTo(models['User'], {foreignKey: 'user_id', constraints: false})

models['Specialty'].hasMany(models['SpecialtyLiked'], {foreignKey: 'specialty_id', constraints: false})
models['SpecialtyLiked'].belongsTo(models['Specialty'], {foreignKey: 'specialty_id', constraints: false})

models['Specialty'].hasMany(models['SpecialtyImg'], {foreignKey: 'specialty_id', constraints: false}) // 2017-11-16 新增
models['SpecialtyImg'].belongsTo(models['Specialty'], {foreignKey: 'specialty_id', constraints: false})

models['Specialty'].hasMany(models['SpecialtyCollected'], {foreignKey: 'specialty_id', constraints: false})
models['SpecialtyCollected'].belongsTo(models['Specialty'], {foreignKey: 'specialty_id', constraints: false})

models['User'].hasMany(models['Coupon'], {foreignKey: 'user_id', constraints: false})
models['User'].belongsTo(models['User'], {foreignKey: 'user_id', constraints: false})

models['User'].hasMany(models['CouponRestaurant'], {foreignKey: 'user_id', constraints: false})
models['CouponRestaurant'].belongsTo(models['User'], {foreignKey: 'user_id', constraints: false})

models['Restaurant'].hasMany(models['CouponRestaurant'], {foreignKey: 'restaurant_id', constraints: false})
models['CouponRestaurant'].belongsTo(models['Restaurant'], {foreignKey: 'restaurant_id', constraints: false})

models['Specialty'].hasMany(models['SpecialtyRecord'], {foreignKey: 'specialty_id', constraints: false})
models['SpecialtyRecord'].belongsTo(models['Specialty'], {foreignKey: 'specialty_id', constraints: false})

models['RestaurantOther'].hasMany(models['Restaurant'], {foreignKey: 'restaurant_other_id', constraints: false})
models['Restaurant'].belongsTo(models['RestaurantOther'], {foreignKey: 'restaurant_other_id', constraints: false})

models['RestaurantScene'].hasMany(models['Restaurant'], {foreignKey: 'restaurant_scene_id', constraints: false})
models['Restaurant'].belongsTo(models['RestaurantScene'], {foreignKey: 'restaurant_scene_id', constraints: false})

models['CardCity'].hasMany(models['RestaurantArea'], {foreignKey: 'area_id', constraints: false})
models['RestaurantArea'].belongsTo(models['CardCity'], {foreignKey: 'area_id', constraints: false})

models['Card'].belongsToMany(models['RestaurantArea'], {through: models['CardCity'], constraints: false, foreignKey: 'card_id'})
models['RestaurantArea'].belongsToMany(models['Card'], {through: models['CardCity'], constraints: false, foreignKey: 'area_id'})

models['User'].hasMany(models['Invoice'], {foreignKey: 'user_id', constraints: false})
models['Invoice'].belongsTo(models['User'], {foreignKey: 'user_id', constraints: false})

models['Order'].hasMany(models['Invoice'], {foreignKey: 'order_id', constraints: false})
models['Invoice'].belongsTo(models['Order'], {foreignKey: 'order_id', constraints: false})

models['OrderGroup'].hasMany(models['Invoice'], {foreignKey: 'order_group_id', constraints: false})
models['Invoice'].belongsTo(models['OrderGroup'], {foreignKey: 'order_group_id', constraints: false})

module.exports.models = models
module.exports.sequelize = db.sequelize
module.exports.sync = db.sync
