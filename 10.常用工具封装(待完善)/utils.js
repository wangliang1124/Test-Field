/**
 * @desc 判断两个数组是否相等
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @return {Boolean}
 */
function arrayEqual(arr1, arr2 ) {
  if (arr1 === arr2) {
    return true
  } 
  if (arr1.length !== arr2.length){
    return false
  } 
  for(let i = 0; i < arr1.length; i += 1) {
    if(arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}

const class utils = {
  // 1. type 类型判断
  isString(o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'String'
  }
  isNumber(o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
  }
  isObject(o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
  }
  isDate(o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
  }
  isBoolean(o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
  }
  isFuntion(o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
  }
  isNull(o) {
    retrun Object.prototype.toString.call(o).slice(8, -1) === 'Null'
  }
  isUndefined(o) {
    return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
  }
  isFalse(o) {
    if(!o || o === 'null' || o === 'undefined' || o === 'false' || o === 'NaN') {
      return true
    }
  }
  isTrue(o) {
    retrun !this.isFalse(o)
  }
  isIPhone() {
    var u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // 安卓手机
      return false
    } else if (u.indexOf('iPhone') > -1) { // 苹果手机
      return true
    } else if (u.indexOf('iPad') > -1) { // ipad
      return false
    } else if (u.indexOf('Window Phone') > -1) {
      return false
    } else {
      return false
    }
  }
  isPC () {
    var u = navigator.userAgent
    var agents = ['Android', 'iPhone', 'iPad', 'iPod', 'SymBianOS', 'Window Phone']
    var f = true
    for( var i = 0; i < agents.length; i += 1){
      if(u.indexOf(agents[i]) > -1) {
        f = false
        break
      }
    }
    return f
  } 
  browserType () {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) return "IE7"
        else if(fIEVersion == 8) return "IE8";
        else if(fIEVersion == 9) return "IE9";
        else if(fIEVersion == 10) return "IE10";
        else if(fIEVersion == 11) return "IE11";
        else return "IE7以下"//IE版本过低
    }

    if (isFF) return "FF";
    if (isOpera) return "Opera";
    if (isEdge) return "Edge";
    if (isSafari) return "Safari";
    if (isChrome) return "Chrome";
  }
  checkStr (str, type) {
      switch (type) {
          case 'phone':   //手机号码
              return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
          case 'tel':     //座机
              return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
          case 'card':    //身份证
              return /^\d{15}|\d{18}$/.test(str);
          case 'pwd':     //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
              return /^[a-zA-Z]\w{5,17}$/.test(str)
          case 'postal':  //邮政编码
              return /[1-9]\d{5}(?!\d)/.test(str);
          case 'QQ':      //QQ号
              return /^[1-9][0-9]{4,9}$/.test(str);
          case 'email':   //邮箱
              return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
          case 'money':   //金额(小数点2位)
              return /^\d*(?:\.\d{0,2})?$/.test(str);
          case 'URL':     //网址
              return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
          case 'IP':      //IP
              return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
          case 'date':    //日期时间
              return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
          case 'number':  //数字
              return /^[0-9]$/.test(str);
          case 'english': //英文
              return /^[a-zA-Z]+$/.test(str);
          case 'chinese': //中文
              return /^[\u4E00-\u9FA5]+$/.test(str);
          case 'lower':   //小写
              return /^[a-z]+$/.test(str);
          case 'upper':   //大写
              return /^[A-Z]+$/.test(str);
          case 'HTML':    //HTML标记
              return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
          default:
              return true;
      }
  }
}
export default uitls