# JS

* 1.解释下事件代理(事件委托delegation)
	+ 解释：利用事件冒泡的原理，把多个子元素的事件及事件处理函数，委托给父元素统一处理。
	+ 用处：减少了事件绑定和删除，减少dom交互，减少内存占用，提高性能。
	+ 比喻：类似于公司前台代收快递
	+ 例如：为父节ul点添加一个click事件监听，当子节点li被点击的时候，click事件会从子节点开始向上冒泡。		父节点捕获到事件之后，通过判断(e.target || e.srcElement(兼容ie)).nodeName来判断是否为我们需要处理的节点。		并且通过e.target拿到了被点击的节点。从而可以获取到相应的信息，并作处理。
	+ 适合用事件委托的事件：click，mousedown，mouseup，keydown，keyup，keypress。
> https://github.com/yonyouyc/blog/issues/25
> https://www.cnblogs.com/owenChen/archive/2013/02/18/2915521.html

* 2.解释下 JavaScript 中 this 是如何工作的。
	+ 每个函数的this是在调用时绑定的，它的值取决于函数的调用位置
	+ 在全局环境使用this，它指的就是顶层对象window || module.exports。
	+ 如果是被一个对象调用的，则指向这个对象
	+ 可以通过call()或apply()强制绑定this
	+ 使用new构造一个对象时，this指向新创建的实例对象
	+ 箭头函数的this就是所在外部作用域的this

* 3.解释下原型继承的原理。
	+ "继承"的说法不准确，因为JS没有父类、子类，类和实例的概念，只有对象
	+ 继承的本质是委托，当要访问一个对象obj的属性时，会先在obj上查找,没有的话，再通过在原型链层层遍历的方式查找需要的属性
	+ 例如函数Foo()在声明时,系统都会创建一个相应的Foo.prototype
	+ 通过new Foo()，新的对象有个__proto__的不可枚举属性指向Foo.prototype
	+ 这个新的对象实例可以直接调用Foo.prototype的属性（或者说所有new的实例对象都可以继承原型上的属性）
	+ 原型链的尽头是Object.prototype
	+ 化繁为简: Object.create()
	> 《你不知道的JavaScript上卷，第二部分第5章原型》
	
* 4.什么是哈希表？
	* 哈希表就是把Key通过一个固定的算法函数即哈希函数转换成一个整型数字，然后就将该数字对数组长度进行取余，取余结果就当作数组的下标，将value存储在以该数字为下标的数组空间里。
	* 当使用哈希表进行查询的时候，就是再次使用哈希函数将key转换为对应的数组下标，并定位到该地址获取value
	* 优点：速度快，时间复杂度为O(1)。
	> http://blog.csdn.net/v_july_v/article/details/6256463

* 5.解释下为什么接下来这段代码不是 IIFE(立即调用的函数表达式)：function foo(){ }();要做哪些改动使它变成 IIFE？
	+ function关键字开头，函数声明, 无法立即运行
	+ 改成表达式才能运行，(function foo(){ }()) 或者 (function foo(){ })()
	+ 可以传参,(function foo(global, undefined){ })(window)

* 6.描述以下变量的区别：null，undefined 或 undeclared？
	+ null：声明了并赋值为null
	+ undefined: 声明了但未赋值
	+ 比如声明一个变量a，如果还未赋值则表示a引用的值未定义，a = null表示a的值是null，而null表示一个空值
	+ null 是一个特殊关键字，不是标识符，我们不能将其当作变量来使用和赋值。undefined是一个标识符，可以被当作变量来使用和赋值。
	+ null 和 undefined 转换为数字的结果不同: +null => 0, +undefined => NaN
	+ undeclared: 变量未声明，作用域里找不到

* 7.什么是闭包，如何使用它，为什么要使用它？
	+ 函数可以创建一个作用域
	+ 在函数外部无法访问函数内部定义的变量
	+ 如果在函数内部声明一个函数，这个函数可以访问父函数的作用域，当把这个子函数所引用的函数对象作为值返回时，这个子函数依然持有父函数作用域引用，这个引用就是闭包

* 8.请举出一个匿名函数的典型用例？
	+ 回调函数 function foo(){ return function() {} }
	+ 立即执行函数 (function(){ })()
	+ 函数表达式 var foo = function() {}

* 9.解释"JavaScript模块模式"以及你在何时使用它。
	+ 利用函数作用域和闭包的特点，把一些功能封装在一个命名空间下
	+ 保持内部数据变量是隐藏且私有的状态，可以避免全局变量污染

* 10.你是如何组织自己的代码？是使用模块模式，还是使用经典继承的方法？
	+ 模块模式用的比较多
	+ 一个组件或者插件，通过es6的import ...from...方式引入

* 11.请指出 JavaScript 宿主对象和原生对象的区别？
	+ 宿主对象是指DOM和BOM等，是由宿主框架通过某种机制注册到JavaScript引擎中的对象
	+ 原生对象是Object、Function、Array、String、Boolean、Number、Date、RegExp、Error、Math，实质上是构造函数。

* 12.Difference between: function Person(){}, var person = Person(), and var person = new Person()?
	+ 第一句声明了一个Person函数
	+ 第二句执行Person函数并把结果返回给变量person(在编译时会先声明person)
	+ 第三句调用Person作为构造函数,new一个新的对象实例，赋值给person

* 12.call 和 .apply 的区别是什么？
	+ call参数是一个个传递的 func.call(obj, arg1, arg2, arg3....)
	+ apply第二个参数是数组形式 func.apply(obj, [arg1,arg2,arg3..])
	+ call的执行效率高于apply，apply对参数进行一系列检验和深拷贝

* 13.请解释 Function.prototype.bind 的作用？
	+ 返回一个预绑定this的函数，这个函数调用时才把this绑定到预先给定的context上

* ~~14.你能解释一下JavaScript中的继承是如何工作的吗？~~

* 15.请尽可能详尽的解释 AJAX 的工作原理。
	+ AJAX的核心由JavaScript XMLHTTPRequest DOM对象组成，通过XMLHTTPRequest对象向服务器发送请求，并监听响应情况，获取数据，并由js操作DOM更新页面。

* 16.请解释 JSONP 的工作原理，以及它为什么不是真正的 AJAX。
* 17.你使用过 JavaScript 模板系统吗？
* 18.请解释变量声明提升。
* 19.请描述下事件冒泡机制。
* 20."attribute" 和 "property" 的区别是什么？
* 21.请指出 document load 和 document ready 两个事件的区别。
* 22.== 和 === 有什么不同？
* 23.你如何从浏览器的 URL 中获取查询字符串参数。
* 24.请解释一下 JavaScript 的同源策略。
* 25.描述一种 JavaScript 中实现 memoization(避免重复运算)的策略。
* 26.什么是三元表达式？“三元” 表示什么意思？
* 27.函数的参数元是什么？
* 28.什么是 "use strict"? 使用它的好处和坏处分别是什么？

* 29.在什么时候你会使用 document.write()？
	+ 会重绘整个页面
	+ 很少使用，首页loading的时候使用过
	+ 广告弹窗

* 30.你何时优化自己的代码？

* 15.请指出浏览器特性检测，特性推断和浏览器 UA 字符串嗅探的区别？

> https://github.com/paddingme/Front-end-Web-Development-Interview-Question/blob/master/questions/7.md
> 答案： https://github.com/infp/Front-end-Interview/blob/master/faq/javascript.md
https://github.com/sunyongjian/blog/issues/23

## 各大互联网公司2014前端笔试面试题–JavaScript篇

* 1.JavaScript是一门什么样的语言，它有哪些特点？
* 2.JavaScript的数据类型都有什么？
* 3.已知ID的Input输入框，希望获取这个输入框的输入值，怎么做？
* 4.希望获取到页面中所有的checkbox怎么做？(不使用第三方框架)
* 5.设置一个已知ID的DIV的html内容为xxxx，字体颜色设置为黑色(不使用第三方框架)
* 6.当一个DOM节点被点击时候，我们希望能够执行一个函数，应该怎么做？
* 7.什么是Ajax和JSON，它们的优缺点。
* 8.看下列代码输出为何？解释原因。 `var a; alert(typeof a); // undefined  alert(b); // 报错`
* 9.看下列代码,输出什么？解释原因。 `var a = null;  alert(typeof a);`
* 10.看下列代码,输出什么？解释原因。
	`var undefined;
	undefined == null; // true
	1 == true;   // true
	2 == true;   // false
	0 == false;  // true
	0 == '';     // true
	NaN == NaN;  // false
	[] == false; // true
	[] == ![];   // true`
> http://www.cnblogs.com/coco1s/p/4029708.html
> http://www.codeceo.com/2014-javascript-interview.html#13688-tsina-1-6076-57d4d90508c08d162896a47818ce968b

## 5个典型的JavaScript面试题
* 问题1：作用域: `(function() { var a = b = 5;})(); console.log(b);`, 请问控制台上会输出什么？
* 问题2：创建"内置"方法: 给String对象定义一个repeatify方法。该方法接收一个整数参数，作为字符串重复的次数，最后返回重复指定次数的字符串。
例如：`onsole.log('hello'.repeatify(3));` 输出应该是 `hellohellohello`
* 声明提前: 下面这段代码的结果是什么？为什么？
`function test() { console.log(a); console.log(foo()); var a = 1; function foo() { return 2;} }; test();`
* 问题4：JavaScript中的this: 下面代码的运行结果是什么并做解释。?
`var fullname = 'John Doe';
var obj = {
	fullname: 'Colin Ihrig',
	prop: {
		fullname: 'Aurelio De Rosa',
		getFullname: function() {
			return this.fullname;
		}
	}
};
console.log(obj.prop.getFullname());
var test = obj.prop.getFullname;
console.log(test());`
* 问题5：call()和apply(): 修复前一个问题，让最后一个console.log() 打印输出'Aurelio De Rosa'.
> http://web.jobbole.com/81785/
> http://web.jobbole.com/92323/?utm_source=blog.jobbole.com&utm_medium=relatedPosts

## 一些JS题目的解答
> https://github.com/xufei/blog/blob/master/posts/2013-12-02-%E4%B8%80%E4%BA%9BJS%E9%A2%98%E7%9B%AE%E7%9A%84%E8%A7%A3%E7%AD%94.md

## 前端开发面试题
> https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions/Questions-and-Answers
> https://github.com/allenGKC/Front-end-Interview-questions
> https://github.com/qiu-deqing/FE-interview

## 航旅无线前端团队必备技能
> https://github.com/jayli/jayli.github.com/issues/16

## ele面试 JavaScript 基础问题
> https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/common.md

## ele面试 Network
> https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/network.md

## HTTP 协议入门 
> http://www.ruanyifeng.com/blog/2016/08/http.html

## 理解RESTful架构
> http://www.ruanyifeng.com/blog/2011/09/restful.html

## 面试前端工程师
> https://github.com/paddingme/Front-end-Web-Development-Interview-Question/blob/master/interview/1.md

# 前端工作面试常见问题

* 1.在制作一个Web应用或Web站点的过程中，你是如何考虑他的UI、安全性、高性能、SEO、可维护性以及技术因素的？
* 2.你能描述一下渐进增强和优雅降级之间的不同吗?
* 3.请解释一下什么是“语义化的 HTML”？
* 4.你如何对网站的文件和资源进行优化？
* 5.请说出三种减少页面加载时间的方法。
* 6.请写一个简单的幻灯效果页面
* 7.请尽可能完整得描述下从输入URL到整个网页加载完毕及显示在屏幕上的整个流程
	* 从输入 URL 到页面加载完成的过程中都发生了什么事情？ http://fex.baidu.com/blog/2014/05/what-happen/
	* FE的角度上再看输入url后都发生了什么 http://div.io/topic/609
	* 当你输入一个网址，实际会发生什么? http://blog.jobbole.com/33951/


# 项目相关
一般来说会问如下几方面的问题：
* 做过最满意的项目是什么？
* 项目背景
	+ 为什么要做这件事情？
	+ 最终达到什么效果？
* 你处于什么样的角色，起到了什么方面的作用？
* 在项目中遇到什么技术问题？具体是如何解决的？
* 如果再做这个项目，你会在哪些方面进行改善？

# 技术相关 - 1 面
* 描述一个你遇到过的技术问题，你是如何解决的？
	+ 这个问题很常见，有没有遇到过很不常见的问题？比如在网上根本搜不到解决方法的？
* 是否有设计过通用的组件？
	+ 请设计一个 Dialog（弹出层） / Suggestion（自动完成） / Slider（图片轮播） 等组件
	+ 你会提供什么接口？
	+ 调用过程是怎样的？可能会遇到什么细节问题？

# 技术相关 - 2 面
技术二面主要判断技术深度及广度

* 你最擅长的技术是什么？
	* 你觉得你在这个技术上的水平到什么程度了？你觉得最高级别应该是怎样的？
* 浏览器及性能
	* 一个页面从输入 URL 到页面加载完的过程中都发生了什么事情？越详细越好（这个问既考察技术深度又考察技术广度，其实要答好是相当难的，注意越详细越好）
	* 谈一下你所知道的页面性能优化方法？
		* 这些优化方法背后的原理是什么？
		* 除了这些常规的，你还了解什么最新的方法么？
	* 如何分析页面性能？
* 其它
	* 除了前端以外还了解什么其它技术么？
	* 对计算机基础的了解情况，比如常见数据结构、编译原理等

# 兴趣相关
* 最近在学什么？接下来半年你打算学习什么？
* 做什么方面的事情最让你有成就感？需求设计？规划？具体开发？
* 后续想做什么？3 年后你希望自己是什么水平？

> 2017-08 面试总结 https://github.com/sunyongjian/blog/issues/32

> 十大经典排序算法总结（JavaScript描述） https://juejin.im/post/57dcd394a22b9d00610c5ec8