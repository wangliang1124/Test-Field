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
	+ 作为回调var myPromise = new Promise(function(resolve, reject){ })
	+ 高阶函数：作为返回值function foo(){ return function() {} }
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

* 13.call 和 .apply 的区别是什么？
	+ call参数是一个个传递的 func.call(obj, arg1, arg2, arg3....)
	+ apply第二个参数是数组形式 func.apply(obj, [arg1,arg2,arg3..])
	+ call的执行效率高于apply，apply对参数进行一系列检验和深拷贝

* 14.请解释 Function.prototype.bind 的作用？
	+ 返回一个预绑定this的函数，这个函数调用时才把this绑定到预先给定的context上

* ~~14.你能解释一下JavaScript中的继承是如何工作的吗？~~

* 15.请尽可能详尽的解释AJAX的工作原理。
	+ AJAX是一种异步的无须刷新整个页面就可以响应用户交互的技术，也就是说它可以只更新或重载部分页面。
	+ AJAX的核心由JavaScript、XMLHTTPRequest、 DOM对象组成，通过XMLHTTPRequest对象向服务器发送请求，并监听响应情况，获取数据，并由js操作DOM更新页面。
	`var xhr = new XMLHttpRequest(); // ie7+ 
	 xhr.onreadystatechange = function() {
			if(readyState === 4) {
				if((xhr.status >= 200 && xhr.stauts < 300) || xhr.status === 304) {
					console.log(xhr.responseText);
				} else {
					console.log('request was failed:' + xhr.status);
				}
			}
	 }
	 xhr.open('get', '/api/test', true)
	 xhr.send(null)
	`
	> https://segmentfault.com/a/1190000004322487 

* 16.请解释 JSONP 的工作原理，以及它为什么不是真正的 AJAX。
	+ 动态创建script标签： var script = document.createElement('script');
	+ 设置script元素的src属性为要请求的url, script.src = 'http://www.test.com/?callback=handleResponse';
	+ 定义处理函数：function handleResponse(res){ console.log(res) }
	+ 把scirpt元素插入页面中的某个位置： document.body.appendChild(script);
	+ callback是约定好的查询query，服务器接收到请求后，用前端提供的函数名handlResponse，把json数据以参数的形式传入，然后返回给浏览器
	+ 因为handlResponse已经声明过，资源下载以后会立即执行。
	+ 因为ajax没有用到XMLHttpRequest去请求资源，因此不是ajax
	+ JSONP是利用script标签没有同源策略限制，可以与第三方通信，从而实现跨域。
	+ 只能实现get请求
	+ 响应可能包含不安全的代码
	+ 要确定JSONP请求是否失败不容易

* 17.你使用过 JavaScript 模板系统吗？
	+ 研究过underscore的_.template()

* 18.请解释变量声明提升。
	+ JavaScirpt代码在被解释之前会被编译
	+ 在编译阶段，编译器会找到作用域内所有的声明，初始值为undefined
	+ 也就是说即使某个变量看起来即使是先赋值后声明的，在内部实际上是在编译阶段声明，在执行阶段赋值
	+ 就好像变量或函数声明从它们在代码中的位置被移动到了最上面，这个过程就叫提升

* 19.请描述下事件冒泡机制。
	+ DOM事件流有三个阶段：捕获阶段、目标阶段、冒泡阶段
	+ 事件触发是会从根元素由外向内的传播，直到目标元素
	+ 然后事件又从最里层的目标元素，逐层冒泡到最外层，在每层都会触发事件
	+ 如果要禁止事件的冒泡，可以在目标元素的事件方法里调用event.stopPropagation()方法

* 20."attribute" 和 "property" 的区别是什么？
	+ attribute是指HTML标签上的属性，attribute只能是字符串
	+ property是指DOM对象的属性
	+ 标准的 DOM properties 与 attributes 是同步的

* 21.请指出 document load 和 document ready 两个事件的区别。
	+ window.onload是网页上所以资源加载完毕才执行，只能有一个
	+ domReady：dom标签加载完毕后即可执行（关联资源还没有加载玩），可以有多个

* 22.== 和 === 有什么不同？
	+ '==' 宽松相等，允许在相等比较中进行强制类型转换
	+ '===' 是严格相等，不允许强制类型转换，注意：+0 === -0
	+ 使用'=='时要注意一些坑：
		+ 其他类型和布尔类型之间的相等比较（避免使用），如： '42' == true // => false 原因：true => 1，1 == '42' => 1 == 42 => false 
		+ null == undefined // => true，除此之外其他值都不存在这种情况。 即 null == false // => false
		+ NaN不等于任何值，包括自己 NaN == NaN // => false

* 23.你如何从浏览器的 URL 中获取查询字符串参数。
	`var qs = (function(queryString){
			var q = queryString.substring(1).split('&')
			if(q == '') return {};
			var result = {};
			for(var i = 0; i < q.length; i++) {
				var arr = q[i].split('=');
				result[arr[0]] = arr[1] ? decodeURIComponent(arr[1].replace(/\+/g, ' ')) : '';
			}
			return result;
		})(window.location.search)
	`

* 24.请解释一下 JavaScript 的同源策略。
	+ 同源：协议(http\https) 域名(www.baidu.com\map.baidu.com) 端口(80\81)
	+ 出于安全的考虑，不允许源a访问源b的资源

	> 跨域CORS http://www.ruanyifeng.com/blog/2016/04/cors.html
	> http://harttle.land/2016/12/28/cors-with-cookie.html
	> https://segmentfault.com/a/1190000012469713
	> https://stackoverflow.com/questions/11474336/same-origin-policy-in-layman-terms

* 25.描述一种 JavaScript 中实现 memoization(避免重复运算)的策略。
	
	> http://taobaofed.org/blog/2016/07/14/performance-optimization-memoization/

* 26.什么是三元表达式？“三元” 表示什么意思？
	+ condition ? expr1 : expr2
	+ 如果条件值为真值（true），运算符就会返回 expr1 的值；否则， 就会返回 expr2 的值

* 27.函数的参数元是什么？
	+ arguments对象
	`var log = function() {
		var args = Array.prototype.slice.call(arguments)
		args.unshift('(app) ')
		console.log(args)
		console.log.apply(console,args)
	}
	log('sss')
	`

* 28.什么是 "use strict"? 使用它的好处和坏处分别是什么？
	+ 将使 JS 代码以严格模式（strict mode）运行。使用了较为严格的错误检测条件检测。
	+ 消除JavaScript语法的不合理不严谨的地方，减少怪异行为
	+ 消除代码代码运行的不安全之处： eval中不允许声明变量； this始终是指定的值，func.call(null)全局下this转换为window
	+ 提高编译效率
	+ 为未来的新版本做铺垫： 淘汰了with arguments.caller arguments.callee
	坏处： 估计写代码没那么随意了

	> 参考： 高程三附录B

* 29.在什么时候你会使用 document.write()？
	+ 会重绘整个页面
	+ 很少使用，首页loading的时候使用过
	+ 广告弹窗

* 30.你何时优化自己的代码？

* 15.请指出浏览器特性检测，特性推断和浏览器 UA 字符串嗅探的区别？
* 17.使用 Ajax 都有哪些优劣？
	* 优势
		+ 无刷新在页面与服务器通信，更新页面，用户体验好。
		+ 异步与服务器通信，不需要打断用户的操作，具有更加迅速的响应能力。
		+ 前端和后端负载平衡。可以把以前一些服务器负担的工作转嫁到客户端，利用客户端闲置的能力来处理，减轻服务器和带宽的负担，节约空间和宽带租用成本。并且减轻服务器的负担，ajax的原则是“按需取数据”，可以最大程度的减少冗余请求，和响应对服务器造成的负担。
		+ 界面与应用分离
		+ Ajax使WEB中的界面与应用分离（也可以说是数据与呈现分离），有利于分工合作、减少非技术人员对页面的修改造成的WEB应用程序错误、提高效率、也更加适用于现在的发布系统。
		+ 基于标准化的并被广泛支持的技术，不需要下载插件或者小程序。
	* 缺点：
		+ AJAX干掉了Back和History功能，即对浏览器机制的破坏。
		+ AJAX的安全问题
		+ Ajax技术就如同对企业数据建立了一个直接通道，这使得开发者在不经意间会暴露比以前更多的数据和服务器逻辑。Ajax也难以避免一些已知的安全弱点，诸如跨站点脚步攻击、SQL注入攻击和基于Credentials的安全漏洞等等
		+ 对搜索引擎支持较弱。
		+ 客户端过肥，太多客户端代码造成开发上的成本。
		+ 违背URL和资源定位的初衷,采用了Ajax技术，也许你在该URL地址下面看到的和我在这个URL地址下看到的内容是不同的。

> https://github.com/paddingme/Front-end-Web-Development-Interview-Question/blob/master/questions/7.md
> 答案： https://github.com/infp/Front-end-Interview/blob/master/faq/javascript.md
https://github.com/sunyongjian/blog/issues/23
我遇到的前端面试题2017 https://segmentfault.com/a/1190000011091907

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
	+ 5

* 问题2：创建"内置"方法: 给String对象定义一个repeatify方法。该方法接收一个整数参数，作为字符串重复的次数，最后返回重复指定次数的字符串。
	例如：`console.log('hello'.repeatify(3));` 输出应该是 `hellohellohello`
	* 答：`String.prototype.repeatify = String.prototype.repeatify || function(times) {
		var str = '';
		var times = + times
		console.log(typeof times)
		for(var i = 0; i < times; i++) {
			str += this;
		}
		return str;
	}
	console.log('hello'.repeatify('3'));
	`

* 问题3：下面这段代码的结果是什么？为什么？
	`function test() { console.log(a); console.log(foo()); var a = 1; function foo() { return 2;} }; test();`
	+ 答： undefined, 2

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
	+ 答： 'Aurelio De Rosa', 'John Doe'

* 问题5：修复前一个问题，让最后一个console.log() 打印输出'Aurelio De Rosa'.
	+ 答： console.log(test.call(obj.prop))

> http://web.jobbole.com/80564/

## 再来5个JavaScript面试题
> http://web.jobbole.com/81785/

## 25个最基本的 JavaScript 面试问题及答案
> http://web.jobbole.com/92323/?utm_source=blog.jobbole.com&utm_medium=relatedPosts

## 代码题

* 1.问题：下面语句的返回值是什么？
`~~3.14`
> 答案：3

* 2.问题：下面的语句的返回值是什么？
`"i'm a lasagna hog".split("").reverse().join("");`
> 答案："goh angasal a m'i"

* 3.问题：window.foo 的值是什么？
`( window.foo || ( window.foo = "bar" ) );`
> 答案："bar" 只有 window.foo 为假时的才是上面答案，否则就是它本身的值。

* 4.问题：下面两个 alert 的结果是什么?
`var foo = "Hello"; 
(function() { 
  var bar = " World";
  alert(foo + bar);
})();
alert(foo + bar);`
> 答案: "Hello World" 和 ReferenceError: bar is not defined

* 5.问题：foo.length 的值是什么?
`var foo = [];
foo.push(1);
foo.push(2);`
> 答案：2

* 6.问题：foo.length 的值是什么？
`var foo = {};
foo.bar = 'hello';`
> 答案: undefined

## 一些JS题目的解答(考察作用域和变量提升、this指向)
> https://github.com/xufei/blog/blob/master/posts/2013-12-02-%E4%B8%80%E4%BA%9BJS%E9%A2%98%E7%9B%AE%E7%9A%84%E8%A7%A3%E7%AD%94.md

## 前端开发面试题
> https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions/Questions-and-Answers
> https://github.com/allenGKC/Front-end-Interview-questions
> https://github.com/qiu-deqing/FE-interview


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

## 2017-08面试总结 
> https://github.com/sunyongjian/blog/issues/32

## 十大经典排序算法总结（JavaScript描述） 
	> 学习JavaScript数据结构与算法
	> https://juejin.im/post/57dcd394a22b9d00610c5ec8
	> ES6的数据结构与算法 https://www.talkingcoder.com/article/6374220543809234154

## 设计模式
	> JavaScript设计模式与开发实践
	> https://segmentfault.com/a/1190000004568177

## 前端工作面试常见问题

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

 > https://github.com/nioteam/jquery-plugins/issues/19

## FEX 面试问题 
> https://github.com/fex-team/interview-questions
