import {ErrorsCategory} from '../config/index'
import {APIError} from '../middlewares/restify'
const JSZip = require('jszip')
const xl = require('excel4node')
const Docxtemplater = require('docxtemplater')
const fs = require('fs')
const path = require('path')
const send = require('koa-send')
const Promise = require('bluebird')
export const entryVerify = async (ctx, next) => {
  return next()
}
/**
 * 获取系统所有开通城市
 */
export const GetProtocol = async (ctx, next) => {
  try {
    ctx.checkQuery('orderId').notEmpty('orderId cannot be null').isInt('orderId must be an int').toInt()
    const order = await ctx.models.Order.findById(ctx.query.orderId)
    if (!order) throw new APIError(404, ErrorsCategory[4], '不存在的订单id')
    const exit = await promiseExits(path.resolve(__dirname, `../../assets/protocol/玥享卡免责声明-8.3-${ctx.query.orderId}.docx`))
    if (exit) {
      const fileName = `玥享卡免责声明-8.3-${ctx.query.orderId}.docx`
      ctx.attachment(fileName)
      await send(ctx, fileName, {root: path.resolve(__dirname, '../../assets/protocol/')})
      return
    }
    var content = await fs.readFileSync(path.resolve(__dirname, '../../assets/玥享卡免责声明-8.3.docx'), 'binary')
    var zip = new JSZip(content)
    var doc = new Docxtemplater()
    doc.loadZip(zip)
    doc.setData({
      name: order.user_name
    })
    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render()
    } catch (error) {
      var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties
      }
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
      throw new APIError(500, ErrorsCategory[0], e.message)
    }
    var buf = doc.getZip().generate({type: 'nodebuffer'})
    await promiseWriteFile(path.resolve(__dirname, `../../assets/protocol/玥享卡免责声明-8.3-${ctx.query.orderId}.docx`), buf)
    const fileName = `玥享卡免责声明-8.3-${ctx.query.orderId}.docx`
    ctx.attachment(fileName)
    await send(ctx, fileName, {root: path.resolve(__dirname, '../../assets/protocol/')})
  } catch (err) {
    throw new APIError(400, ErrorsCategory[2], err.message)
  }
}
async function promiseExits (filePath) {
  return new Promise((resolve, reject) => {
    fs.exists(filePath, (exists) => {
      resolve(exists)
    })
  })
}
async function promiseWriteFile (filePath, buf) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, buf, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
export const GetExcel = async(ctx, next) => {
  let data = ctx.query.data
  try {
    data = JSON.parse(data)
  } catch (e) {
    console.log(e)
    throw new APIError(400, ErrorsCategory[2], '数据错误')
  }
  if (!data || !data.name || !data.tableData || !data.tableHeader) {
    throw new APIError(400, ErrorsCategory[2], '数据错误')
  }
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet('Sheet 1')
  for (let i = 0; i < data.tableHeader.length; i++) {
    ws.column(i + 1).setWidth(15)
    ws.row(1).setHeight(20)
    ws.cell(1, i + 1).string(data.tableHeader[i]).style({
      font: {
        bold: true,
        size: 14
      },
      alignment: {
        justifyLastLine: true,
        horizontal: 'center',
        vertical: 'center'
      }
    })
  }
  for (let i = 0; i < data.tableData.length; i++) {
    ws.row(i + 2).setHeight(20)
    for (let j = 0; j < data.tableData[i].length; j++) {
      switch (data.tableData[i][j].type) {
        case 'string':
          ws.cell(i + 2, j + 1).string(data.tableData[i][j].value).style({
            font: {
              bold: false,
              size: 10
            },
            alignment: {
              justifyLastLine: true,
              horizontal: 'center',
              vertical: 'center'
            }
          })
          break
        case 'number':
          ws.cell(i + 2, j + 1).number(data.tableData[i][j].value).style({
            font: {
              bold: false,
              size: 10
            },
            alignment: {
              justifyLastLine: true,
              horizontal: 'center',
              vertical: 'center'
            }
          })
          break
        case 'date':
          ws.cell(i + 2, j + 1).string(data.tableData[i][j].value).style({
            font: {
              bold: false,
              size: 10
            },
            alignment: {
              justifyLastLine: true,
              horizontal: 'center',
              vertical: 'center'
            }
          })
          break
        default:
          ws.cell(i + 2, j + 1).string(data.tableData[i][j].value).style({
            font: {
              bold: false,
              size: 10
            },
            alignment: {
              justifyLastLine: true,
              horizontal: 'center',
              vertical: 'center'
            }
          })
      }
    }
  }
  const excelBuffer = await wb.writeToBuffer()
  ctx.response.set({
    'Content-Length': excelBuffer.length,
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': 'attachment; filename="' + `${data.name}.xlsx` + '"'
  })
  ctx.body = excelBuffer
}
