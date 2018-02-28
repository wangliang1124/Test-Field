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

## 5. new会执行什么操作

* 创建新的对象
* 新对象的__proto__属性的值设置为构造函数的prototype属性值
* 构造函数中的this指向该对象, 执行构造函数中的代码
* 返回对象(除非构造函数返回一个对象)

` // 模拟new
  function Person() { this.name = a; console.log(this) }
  function init() {
    var p = {}; // 创建新的对象
    p.__proto__ = Person.prototype; // 新对象的__proto__属性的值设置为构造函数的prototype属性值
    var temp = Person.call(p, 'John'); // 构造函数中的this指向该对象, 执行构造函数中的代码
    if(temp !== null && typeof temp === 'object')     // 返回对象(除非构造函数返回一个对象)
      return temp;
    return p;
  }
`

## 6. 关于bind & new
先看MDN上bind的polyfill

  `
 
    if (!Function.prototype.bind) {
      Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
          throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
              return fToBind.apply(this instanceof fNOP
                     ? this
                     : oThis,
                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
          // Function.prototype doesn't have a prototype property
          fNOP.prototype = this.prototype; 
        }
        fBound.prototype = new fNOP();

        return fBound;
      };
    }
    
  `
接着，这是《你不知道的JavaScript》中的一段代码，这段代码怎么执行的？

  `
  
    function foo(something) {
      this.a = something;
    }
    var obj1 = {};
    var bar = foo.bind( obj1 ); 
    bar( 2 );
    console.log( obj1.a ); // 2
    var baz = new bar(3);
    console.log( obj1.a ); // 2
    console.log( baz.a ); // 3
  `

首先看这一句`var bar = foo.bind( obj1 ); `, bind被foo调用（bind的执行环境是foo），因此polyfill中`fToBind = this,`的this就是foo，模拟过程如下：
  
  `
   
    var obj1 = {'__proto__': foo.prototype}
    fNOP.apply(obj1, arguments);
    fbound.prototype = obj1;
    bar = fBound;
   `

然后看这一句`var baz = new bar(3);`，模拟如下：

  `
  
    // bar.prototype === obj1, obj1 === { __proto__: foo.prototype }, foo.prototype === { constructor: foo, __proto__} 
    var obj2 = { __proto__: bar.prototype }  //  obj2 = { __proto__: {__proto__: { constructor: foo, __proto__} } }
    bar.apply(obj2, arguments)
    baz = obj2
  `