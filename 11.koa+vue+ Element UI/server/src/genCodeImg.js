require('babel-register')
const fs = require('fs')
const qrcode = require('qrcode')
const im = require('imagemagick')
const {models, sequelize} = require('./models/')
async function promiseWriteFile (filePath, buf) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, buf, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
async function promiseAppendFile (filePath, buf) {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, buf, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
function QRCodeToDataUrl (code) {
  return new Promise((resolve, reject) => {
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'png',
      scale: 30
    }
    const url = `http://ysj.tcfellow.com/card?code=${code}`
    qrcode.toDataURL(url, opts, function (err, url) {
      if (err) reject(err)
      resolve(url)
    })
  })
}
// function QRCodeToFile (path, text, opts) {
//   return new Promise((resolve, reject) => {
//     qrcode.toFile(path, text, opts, function (err, url) {
//       if (err) reject(err)
//       resolve(url)
//     })
//   })
// }
exports.genCodeImg = async function (sequelize, models) {
  const activations = await models.CardActivation.findAll()
  for (let i = 0; i < activations.length; i++) {
    if (activations[i].card_id === 13) {
      console.log(`正在生成第${i}张图片`)
      let data = `${activations[i].code}\n`
      // fs.appendFile('../assets/files/cika.text', data)
      await promiseAppendFile('../assets/files/cika.txt', data)
      // const base64img = await QRCodeToDataUrl(activations[i].code)
      // const base64Data = base64img.replace(/^data:image\/\w+;base64,/, '')
      // const dataBuffer = new Buffer(base64Data, 'base64')
      // await promiseWriteFile(`../assets/codeImg/cika/${activations[i].code}.png`, dataBuffer)
      // im.resize({
      //   srcData: fs.readFileSync(`../assets/codeImg/${activations[i].code}.png`, 'binary'),
      //   width: 300
      // }, function (err, stdout, stderr) {
      //   if (err) console.log(err)
      //   fs.writeFileSync(`../assets/codeImg/${activations[i].code}-300.png`, stdout, 'binary')
      //   console.log('resized kittens.jpg to fit within 300px')
      // })
    } else {
       console.log(`正在生成第${i}张图片`)
      let data = `${activations[i].code}\n`
      await promiseAppendFile('../assets/files/ninaka.txt', data)
      // fs.appendFile('../assets/files/ninaka.text', data)
      // const base64img = await QRCodeToDataUrl(activations[i].code)
      // const base64Data = base64img.replace(/^data:image\/\w+;base64,/, '')
      // const dataBuffer = new Buffer(base64Data, 'base64')
      // await promiseWriteFile(`../assets/codeImg/nianka/${activations[i].code}.png`, dataBuffer)
      // im.resize({
      //   srcData: fs.readFileSync(`../assets/codeImg/${activations[i].code}.png`, 'binary'),
      //   width: 300
      // }, function (err, stdout, stderr) {
      //   if (err) console.log(err)
      //   fs.writeFileSync(`../assets/codeImg/${activations[i].code}-300.png`, stdout, 'binary')
      //   console.log('resized kittens.jpg to fit within 300px')
      // })
    }
  }
}
exports.genCodeImg(sequelize, models)
