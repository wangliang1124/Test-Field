 参考资料：

  * Underscore.js源码解读&系列文章 
    https://github.com/hanzichi/underscore-analysis 
    源码注释：https://github.com/hanzichi/underscore-analysis/blob/master/underscore-1.8.3.js/underscore-1.8.3-analysis.js
  * Underscore源码分析 
    https://www.gitbook.com/book/yoyoyohamapi/undersercore-analysis/details
    源码注释：https://github.com/yoyoyohamAPI/underscore/blob/master/underscore.analysis.js


学习方法： 照敲代码，注释之


## 1.  i++ a和 ++i 的区别
  The value i++ is the value of i before the increment. The value of ++i is the value of i after the increment.
  Example:
    `
      var i = 42;
      alert(i++); // shows 42
      alert(i); // shows 43
      i = 42;
      alert(++i); // shows 43
      alert(i); // shows 43
    `

## 2. valueOf & toString

### String转换 toString
* 在某个操作或者运算需要字符串的时候，往往会触发Object的String转换，举个例子:
  `
    var obj={name:'Mofei'}
    var str = ' ' + obj
    console.log(str);  //   [object Object]

    parseInt(0.0000004)  // => 4   // 0.0000004 === 4e-7; parseInt(4e-7)
  `
  具体规则如下：

  1.如果toString方法存在并且返回“原始类型”，返回toString的结果。
  2.如果toString方法不存在或者返回的不是“原始类型”，调用valueOf方法，如果valueOf方法存在，并且返回“原始类型”数据，返回valueOf的结果。
  3.其他情况，抛出错误。

## Number转换 valueOf
* 当需要使用Number时，（ 如Math.sin() ）等，解释器会尝试将对象转换成Number对象。

  通常有如下的情况会触发Number转换

  1.方法参数需要Number的时候，如Math.sin(obj)等
  2.对比的时候，如 obj == 'abc'
  3.运算的时候，如 obj + 123

  转换规则如下：

  1.如果valueOf存在，且返回“原始类型”数据，返回valueOf的结果。
  2.如果toString存在，且返回“原始类型”数据，返回toString的结果。
  3.报错。

## Boolean转换
在进行布尔比较的时候，比如 if(obj) , while(obj)等等，会进行布尔转换，布尔转换遵循如下规则：
`
  [] == ![]  // => true
  // 首先第一步右边的是逻辑判断![]，说以先转成boolean ![] == false
  // 左边不是原始类型，尝试把左边转成原始类型，变成 '' == false
  // 转成Number 0 == 0
`
> http://frontenddev.org/link/conversion-of-tostring-and-the-valueof-javascript-object.html

## 3. _.isNaN Bug
  `
    _.isNaN = function(obj) {
      return _.isNumber(obj) && obj !== +obj; // 修复_.isNumber(obj) && isNaN(obj);
    };
  `
bug: var a = new Number(0);  a !== +a // => true // 转化为 Number{0} !== 0 

## 4.  经典的随机排列 O(n) 复杂度
  `
  function shuffle(arr){
    var len = arr.length;
    for(var i = 0; i < len - 1; i++){
      var idx = ~~(Math.random() * (len - i));  //  ~~(取整) == Math.floor 
      var temp = arr[idx];
      arr[idx] = arr[len - i - 1];
      arr[len - i -1] = temp;
    }
    return arr;
  }
  `
> https://www.h5jun.com/post/array-shuffle.html