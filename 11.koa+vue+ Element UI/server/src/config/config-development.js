import path from 'path'

// 系统配置
export let System = {
  API_server_type: 'http://', // API服务器协议类型,包含"http://"或"https://"
  API_server_host: 'localhost', // API服务器暴露的域名地址,请勿添加"http://"
  API_server_port: '3000', // API服务器监听的端口号
  HTTP_server_type: 'http://', // HTTP服务器协议类型,包含"http://"或"https://"
  HTTP_server_host: 'localhost', // HTTP服务器地址,请勿添加"http://" （即前端调用使用的服务器地址，如果是APP请设置为 * ）
  HTTP_server_port: '3000', // HTTP服务器端口号
  System_country: 'zh-cn', // 所在国家的国家代码
  System_plugin_path: path.join(__dirname, './plugins'), // 插件路径
  Session_Key: 'RESTfulAPI', // 生产环境务必随机设置一个值
  API_version: 'v1', // API版本号
  JWT_secret: 'yueshiji', // 验证加密字符串,定期更换
  JWT_expiresIn: 60 * 60 * 24 * 1, // token失效时间设置
  pubWxAppSecret: '099421dbaf9b38790b9a57103515529e', // 微信公众平台的Secret
  pubWxAppId: 'wxfc34b0cedd6ce73f' // 微信公众平台的AppId
}

export let DB = {
  host: 'localhost', // 服务器地址
  port: 32771, // 数据库端口号
  username: 'root', // 数据库用户名
  password: 'root', // 数据库密码
  database: 'yueshiji', // 数据库名称
  prefix: 'api_' // 默认"api_"
}

// export let DB = {
//   host: 'rm-8vb4j84o1l66ercw8o.mysql.zhangbei.rds.aliyuncs.com', // 服务器地址
//   port: 3306, // 数据库端口号
//   username: 'rds_root_root', // 数据库用户名
//   password: 'Yueshiji123', // 数据库密码
//   database: 'yueshiji', // 数据库名称
//   prefix: 'api_' // 默认"api_"
// }

export let SendEmail = {
  service: 'smtp.abcd.com', // SMTP服务提供商域名
  username: 'postmaster%40abcd.com', // 用户名/用户邮箱
  password: 'password', // 邮箱密码
  sender_address: '"XX平台 👥" <postmaster@abcd.com>'
}

export let ErrorsCategory = [
  'Internal: unknown_error,something is broken',
  'Authentication: authenticate failed in your request',
  'Bad Request: your request is now allow at this time',
  'Validatation: params validate failed in your request',
  'Not Found: resource not found, do not exit or be deleted yet'
]
