# JS
## 1.介绍js的基本数据类型。[基础]
* Boolean,Null,Undefined,Number,String,Symbol (ECMAScript 6 新定义)

## 2.介绍js有哪些内置对象？[基础]
*  Object 是 JavaScript 中所有对象的父对象
* 数据封装类对象：Object、Array、Boolean、Number 和 String
 * 其他对象：Function、Arguments、Math、Date、RegExp、Error
> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects

## 3.说几条写JavaScript的基本规范？
* 格式、注释、语言特性

> JavaScript编码规范 https://github.com/fex-team/styleguide/blob/master/javascript.md

> Airbnb JavaScript Style Guide https://github.com/airbnb/javascript

## 5.JavaScript有几种类型的值？，你能画一下他们的内存图吗？[基础]
* 栈：原始数据类型（Undefined，Null，Boolean，Number、String）
* 堆：引用数据类型（对象、数组和函数）
* 两种类型的区别是：存储位置不同；
* 原始数据类型直接存储在栈(stack)中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储.
* 引用数据类型存储在堆(heap)中的对象,占据空间大、大小不固定,如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体

## 6.如何将字符串转化为数字，例如'12.3b'?
* parseFloat('12.3b',10)

## 7.如何将浮点数点左边的数每三位添加一个逗号，如12000000.11转化为『12,000,000.11』?
```javascript
function commafy(num){
    return num && num
      .toString()
      .replace(/(\d)(?=(\d{3})+\.)/g, function($1, $2){
        return $2 + ',';
      });
  }
let milliFormat = (input) => {
  return input && input.toString()
      .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
console.log(milliFormat(1200000123123.223))
```

  > 千位分隔符的完整攻略 https://www.tuicool.com/articles/ArQZfui
  
## 8.如何实现数组的随机排序？
* 数组乱序 https://github.com/hanzichi/underscore-analysis/issues/15

## 9.Javascript如何实现继承？10.JavaScript继承的几种实现方式？ [基础]
 * 原型链继承
 * 构造函数继承
 * 组合继承（原型链+构造函数）
 * 寄生组合继承
 * JS继承的实现方式 http://www.cnblogs.com/humin/p/4556820.html

> Javascript高级程序设计第三版. 6.3 继承 

## 11.javascript创建对象的几种方式？ [基础]
* 1、对象字面量的方式
  ```javascript
  person={firstname:"Mark",lastname:"Yun",age:25,eyecolor:"black"};
  ```
* 2、用function来模拟无参的构造函数
  ```javascript
  function Person(){}
  var person=new Person();//定义一个function，如果使用new"实例化",该function可以看作是一个Class
  person.name="Mark";
  person.age="25";
  person.work=function(){
    alert(person.name+" hello...");
  }
  person.work();
  ```
 * 3、用function来模拟参构造函数来实现（用this关键字定义构造的上下文属性）
  ```javascript
  function Pet(name,age,hobby){
     this.name=name;//this作用域：当前对象
     this.age=age;
     this.hobby=hobby;
     this.eat=function(){
        alert("我叫"+this.name+",我喜欢"+this.hobby+",是个程序员");
     }
  }
  var maidou =new Pet("麦兜",25,"coding");//实例化、创建对象
  maidou.eat();//调用eat方法
  ```
 * 4、用工厂方式来创建（内置对象）
   ```javascript
   var wcDog =new Object();
   wcDog.name="旺财";
   wcDog.age=3;
   wcDog.work=function(){
     alert("我是"+wcDog.name+",汪汪汪......");
   }
   wcDog.work();
   ```
 * 5、用原型方式来创建
  ```javascript
  function Dog(){ }
   Dog.prototype.name="旺财";
   Dog.prototype.eat=function(){
    alert(this.name+"是个吃货");
   }
   var wangcai =new Dog();
   wangcai.eat();
   ```
 * 6、用混合方式来创建
  ```javascript
  function Car(name,price){
    this.name=name;
    this.price=price;
  }
   Car.prototype.sell=function(){
     alert("我是"+this.name+"，我现在卖"+this.price+"万元");
    }
  var camry =new Car("凯美瑞",27);
  camry.sell(); 
  ```

## 12.Javascript作用链域? [基础]
* 函数创建时会建立一个预先包含全局变量对象的作用域链（保存在[[scope]]属性中），当函数被调用时，会创建一个当前活动变量和包含环境变量对象的集合，这就是执行环境的作用域链，它的开始是当前的活动对象，然后是包含环境中的变量对象，直到全局环境。（标识符所在的位置越深，访问速度越慢，因此尽量少使用全局变量。） 
## 14.eval是做什么的？
* 把字符串解析成JS代码并运行；

## 15.什么是window对象? 什么是document对象? [基础]
 * window对象--代表浏览器中的一个打开的窗口或者框架，window对象会在<body>或者<frameset> 每次出现时被自动创建，在客户端JavaScript中，Window对象是全局对象
 * document对象--代表整个HTML文档，可以用来访问页面中的所有元素。每一个载入浏览器的HTML文档都会成为document对象。document对象使我们可以从脚本中对HTML页面中的所有元素进行访问。

## 17.写一个通用的事件侦听器函数。 [基础]
* http://www.cnblogs.com/isaboy/p/eventJavascript.html
* [EventUtil](./code/EventUtil.js)

## 18.["1", "2", "3"].map(parseInt) 答案是多少？
 * [1, NaN, NaN], 相当于["1", "2", "3"].map(parseInt(value, index)), index为0时，用10进制解析

## 19.事件是？IE与火狐的事件机制有什么区别？ 如何阻止冒泡？ [基础]
* IE是事件冒泡、Firefox同时支持两种事件模型，也就是：捕获型事件和冒泡型事件；
 * ev.stopPropagation();（旧ie的方法 ev.cancelBubble = true;）

~~## 20.什么是闭包（closure），为什么要用它？~~
~~## 21.javascript 代码中的"use strict";是什么意思 ? 使用它区别是什么？~~

## 22.如何判断一个对象是否属于某个类？ [基础]
* obj instanceof Func, obj.constructor === Func, Func.prototype.isPrototypeOf(obj)

## 23.new操作符具体干了什么呢? [基础]
```javascript
  var obj  = {};
  obj.__proto__ = Base.prototype;
  Base.call(obj)
```

## 23.用原生JavaScript的实现过什么功能吗？

## 24.Javascript中，有一个函数，执行时对象查找时，永远不会去查找原型，这个函数是？ [基础] 
 * Object.prototype.hasOwnProperty()

## 25.JSON 的了解？ [基础]
> JSON：如果你愿意一层一层剥开我的心，你会发现...这里水很深——深入理解JSON https://segmentfault.com/a/1190000008832185

## 26.能解释一下这段代码的意思吗？
```javascript
[].forEach.call($$("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)}) 
```
* $$: 等价querySelectorAll() 或 document.all(非正式)
* ~~：等价Math.floor 或 parseInt
* 1<<24: 等价 1000000000000000000000000 2^24

> 从一行代码里面学点JavaScript http://www.html-js.com/article/2315

## 27.JS延迟加载的方式有哪些（异步加载JS的方式有哪些？）？
 * defer和async、动态创建DOM方式（用得最多）、模块化

 > Javascript 异步加载详解 http://www.cnblogs.com/tiwlin/archive/2011/12/26/2302554.html

~~## 28.Ajax 是什么? 如何创建一个Ajax~~

## 29.Ajax解决浏览器缓存问题？
  * 1、在ajax发送请求前加上 anyAjaxObj.setRequestHeader("If-Modified-Since","0")。
  * 2、在ajax发送请求前加上 anyAjaxObj.setRequestHeader("Cache-Control","no-cache")。
  * 3、在URL后面加上一个随机数： "fresh=" + Math.random(); 或 "nowtime=" + new Date().getTime();。

~~## 30.同步和异步的区别?~~  ~~## 31.如何解决跨域问题?~~
~~## 32.页面编码和被请求的资源编码如果不一致如何处理？~~ 

## 33.服务器代理转发时，该如何处理cookie？
* HTTP 代理如何正确处理 Cookie https://www.ibm.com/developerworks/cn/java/j-cookie/index.html

## 34.模块化开发怎么做？ 35.AMD（Modules/Asynchronous-Definition）、CMD（Common Module Definition）规范区别？ [基础]
> 详解JavaScript模块化开发 https://segmentfault.com/a/1190000000733959
> http://www.ruanyifeng.com/blog/2012/10/javascript_module.html

## 36.requireJS的核心原理是什么？（如何动态加载的？如何避免多次加载的？如何 缓存的？）[进阶]
> requirejs的用法和原理分析 https://github.com/HRFE/blog/issues/10

## 37.JS模块加载器的轮子怎么造，也就是如何实现一个模块加载器？ [进阶]
> 如何实现一个异步模块加载器--以requireJS为例 https://github.com/youngwind/blog/issues/98
> AMD加载器分析与实现 https://github.com/creeperyang/blog/issues/17
> 如何实现一个 CMD 模块加载器 http://annn.me/how-to-realize-cmd-loader/

## 38.谈一谈你对ECMAScript6的了解？ [基础]
## 39.ECMAScript6 怎么写class么，为什么会出现class这种东西? [基础]
## 40..call() 和 .apply() 的区别？ [基础]

## 41.数组和对象有哪些原生方法，列举一下？ [基础]
> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object

## 42.JS怎么实现一个类，怎么实例化这个类？ [基础]
> http://www.ruanyifeng.com/blog/2012/07/three_ways_to_define_a_javascript_class.html

~~## 43.JavaScript中的作用域与变量声明提升？~~

## 44.如何编写高性能的Javascript？ [进阶]
> 雅虎前端优化的35条军规 http://www.cnblogs.com/xianyulaodi/p/5755079.html <br>
> 编写高性能的Javascript http://www.alloyteam.com/2012/11/performance-writing-efficient-javascript/ <br>
> 吹毛求疵的追求优雅高性能JavaScript https://github.com/jawil/blog/issues/2

## 45.哪些操作会造成内存泄漏？ [进阶]
> 4种JavaScript内存泄漏浅析及如何用谷歌工具查内存泄露 https://github.com/wengjq/Blog/issues/1
> 4 Types of Memory Leaks in JavaScript and How to Get Rid Of Them https://mp.weixin.qq.com/s/MCmlbI2Z5TAvkCgpqDN4iA

## 46.如何判断当前脚本运行在浏览器还是node环境中？ [基础]
* typeof global == 'object' && global.global === global

## 48.把 Script 标签放在页面的最底部的body封闭之前 和封闭之后有什么区别？浏览器会如何解析它们？ [基础]

## 49.移动端的点击事件的有延迟，时间是多久，为什么会有？ 怎么解决这个延时？ [基础]
> 300 毫秒点击延迟的来龙去脉 https://thx.github.io/mobile/300ms-click-delay

## 51.Underscore 对哪些 JS 原生对象进行了扩展以及提供了哪些好用的函数方法？  [进阶]

~~## 53.解释一下 Backbone 的 MVC 实现方式？~~

## 54.什么是“前端路由”?什么时候适合使用“前端路由”? “前端路由”有哪些优点和缺点? [基础]
> 什么是前端路由 http://www.cnblogs.com/yuqing6/p/6731980.html

## 56.前端templating(Mustache, underscore, handlebars)是干嘛的, 怎么用? 
> 浅谈前端模版 http://blog.gejiawen.com/2015/04/08/talk-about-fontend-templates/

## 58.检测浏览器版本版本有哪些方式？  [基础]
> JS 获得浏览器类型和版本 https://segmentfault.com/a/1190000007640795

## 59.我们给一个dom同时绑定两个点击事件，一个用捕获，一个用冒泡。会执行几次事件，会先执行冒泡还是捕获？ [基础]
* 绑定在被点击元素的事件是按照代码顺序发生，其他元素通过冒泡或者捕获“感知”的事件，按照W3C的标准，先发生捕获事件，后发生冒泡事件。所有事件的顺序是：其他元素捕获阶段事件 -> 本元素代码顺序事件 -> 其他元素冒泡阶段事件 。

> https://blog.csdn.net/qiqingjin/article/details/51387217

## 60.使用JS实现获取文件扩展名？ [基础]
>`function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }`
* '>>>'把数字转换成无无符号整数
> [译]如何更有效的获取文件扩展名 https://segmentfault.com/a/1190000004993946

## 61.Webpack热更新实现原理? [进阶]
> https://zhuanlan.zhihu.com/p/30623057

## 62.请介绍一下JS之事件节流？什么是JS的函数防抖？  [进阶]
> JavaScript 函数节流和函数去抖应用场景辨析  https://github.com/hanzichi/underscore-analysis/issues/20
> underscore 函数去抖的实现  https://github.com/hanzichi/underscore-analysis/issues/21
> underscore 函数节流的实现 https://github.com/hanzichi/underscore-analysis/issues/22

## 63.Object.is() 与原来的比较操作符“ ===”、“ ==”的区别？ [基础]
* Object.is: Object.is(-0, +0) === false, Object.is(NaN, NaN) === true
* -0 === +0, NaN !== NaN; -0 == +0, NaN != NaN 
> 详解Object.is()与比较操作符===、== https://www.jianshu.com/p/a76dc7e0c5a1

## 64.ES6是如何实现编译成ES5的？ [进阶]
> Babel是如何读懂JS代码的 https://zhuanlan.zhihu.com/p/27289600
> 深入理解Babel原理及其使用，babel把ES6转成ES5的原理是什么？ http://www.fly63.com/article/detial/197

## 65.DOM操作——怎样添加、移除、移动、复制、创建和查找节点。 [基础]
> 深入浅出DOM基础——《DOM探索之基础详解篇》学习笔记 https://github.com/jawil/blog/issues/9

## 45个JavaScript小技巧 
> http://www.cnblogs.com/zichi/p/5094902.html

## 汤姆大叔的6道javascript编程题题解 
> http://www.cnblogs.com/zichi/p/4362292.html

## 从一道前端笔试题分析 javascript 中 this 的使用陷阱
> https://github.com/wengjq/Blog/issues/21