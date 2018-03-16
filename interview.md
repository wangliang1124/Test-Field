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
	> https://stackoverflow.com/questions/8877666/how-is-a-javascript-hash-map-implemented

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

* 12.请指出以下代码的区别： function Person(){}, var person = Person(), and var person = new Person()?
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

* 21.Difference between document load event and document DOMContentLoaded event?
	+ window.onload是网页上所以资源加载完毕才执行，只能有一个
	+ DOMContentLoaded: dom标签加载完毕后即可执行（关联资源还没有加载玩）
	> The DOMContentLoaded event is fired when the document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading (the load event can be used to detect a fully-loaded page).
	> https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded

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
	+ 坏处： 估计写代码没那么随意了

> 参考： 高程三附录B

* 29.在什么时候你会使用 document.write()？
	+ 会重绘整个页面
	+ 很少使用，首页loading的时候使用过
	+ 广告弹窗


* 15.请指出浏览器特性检测，特性推断和浏览器 UA 字符串嗅探的区别？
	+ 特性检测：
		`if (window.XMLHttpRequest) {
	    new XMLHttpRequest();
		}`
	+ 特征推断:
	`if (document.getElementsByTagName) {
	    element = document.getElementById(id);
	}`
	+ UA字符串嗅探:
	`if (navigator.userAgent.indexOf("MSIE 7") > -1){
    //do something
	}`

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
* 请实现一个遍历至 100 的 for loop 循环，在能被 3 整除时输出 "fizz"，在能被 5 整除时输出 "buzz"，在能同时被 3 和 5 整除时输出 "fizzbuzz"。
		`for(var i = 0; i <= 100; i++) {
			if(i % 3 === 0) console.log( i + 'fizz')
			if(i % 5 === 0) console.log(i + 'buzz')
			if(i % 3 === 0 && i % 5 === 0) console.log(i + 'fizzbuzz')
		}
		`
* Why is it, in general, a good idea to leave the global scope of a website as-is and never touch it?
	+ 安全，变量直接暴露在全局，任何人都可能修改
	+ 减少名称冲突
	+ 利于模块化
	+ 优雅

* Why would you use something like the load event? Does this event have disadvantages? Do you know any alternatives, and why would you use those?
	+ load event tells browser to do something only after everthing including frames, images, asynchronous JavaScripts are fully loaded.
	+ If you want event function to execute before fully loaded frames, images, async scripts, use domcontentloaded instead.

* Explain what a single page app is and how to make one SEO-friendly.
* What is the extent of your experience with Promises and/or their polyfills?
	`new Promise((resolve, reject) => {
		if (resolve) {
			resolve('success')；
		} else {
			reject('failed')
		}
	}).then((result) => {
			console.log(result)
	})`
	+ polyfill: bluebird

* What are the pros and cons of using Promises instead of callbacks?
	+ 地狱回掉
	+ 信任
	+ 错误处理

* What tools and techniques do you use debugging JavaScript code?
	+	Chrome Dev Tools.

* What language constructions do you use for iterating over object properties and array items?
	+ Array
		+ for
		+ forEach
	+ Object
		+ for(var key in obj) { if(obj.hasOwnProperty(key)){ // 过滤不可枚举属性 } } 
		+ Object.keys(obj).forEach

* Explain the difference between mutable and immutable objects.
	* What is an example of an immutable object in JavaScript?
	* What are the pros and cons of immutability?
	* How can you achieve immutability in your own code?

> Mutable object means its state is allowed to be changed over time. Immutable object's value doesn't change from the time it was created.

> Immutable examples are primitive types like String, Number. You can't change the definition of 2 after executing 2 + 5. No matter how you operate strings, the definition of c won't change.

> Mutable examples are array, object or anything opposite to immutability. You can change the value of an array or object anytime and the result will be what you desired.

> Immutable object won't be changed after it has been initialized. We can take advantage of this. Making immutable objects into a collection of cache since these objects don't change at all. Our program is actually accessing the same data. This is a good approach to saving memory by taking advantage of immutable. The downside of immutability is that it actually involving constantly deep clone and assigning. This is an overhead of trading computing speed for memory.

> To achieve immutability on array or object or any type you want, you have to do deep clone, or simply use library like immutable.js developed by Facebook.

> facebook immutable.js 意义何在，使用场景？ https://www.zhihu.com/question/28016223


* Explain the difference between synchronous and asynchronous functions.
	+ 同步是阻塞的，异步是非阻塞的
		`function blocking(){
	    console.log("1");
	    console.log("2");
		}
		function nonBlocking(){
		    setTimeout(function(){
		        console.log("1");
		    }, 1000);
		    console.log("2");
		}`

> https://stackoverflow.com/questions/748175/asynchronous-vs-synchronous-execution-what-does-it-really-mean


* What is event loop? What is the difference between call stack and task queue?

> Event loop is how JavaScript with single-threaded performs tasks without blocking.

> Event loop is a queue of callback functions. When a asynchronous function executes, it is pushed into task queue and JavaScript will only start processing task queue after codes after async function are executed.

> The difference between call stack and task queue is that task queue is a place where JavaScrip schedules async function while call stack is a place for JavaScript to trace what the current function is.

> 什么是 Event Loop？ http://www.ruanyifeng.com/blog/2013/10/event_loop.html

> JavaScript 运行机制详解：再谈Event Loop  http://www.ruanyifeng.com/blog/2014/10/event-loop.html

* Explain the differences on the usage of foo between function foo() {} and var foo = function() {}
	+ 函数声明 和 函数表达式	

* What are the differences between variables created using let, var or const?
	+ var、let、const 区别？ https://www.jianshu.com/p/4e9cd99ecbf5

+ 箭头函数，解构赋值，字符串模版，扩展符

* What is the definition of a higher-order function?

>  JavaScript高阶函数的应用 https://segmentfault.com/a/1190000012008266

* Can you give an example of a curry function and why this syntax offers an advantage?

 > JavaScript专题之函数柯里化 https://github.com/mqyqingfeng/Blog/issues/42

> https://github.com/paddingme/Front-end-Web-Development-Interview-Question/blob/master/questions/7.md
> 答案： https://github.com/infp/Front-end-Interview/blob/master/faq/javascript.md
https://github.com/sunyongjian/blog/issues/23
http://andrewyan.logdown.com/posts/643979-front-end-job-interview-questions
我遇到的前端面试题2017 https://segmentfault.com/a/1190000011091907

## 各大互联网公司2014前端笔试面试题–JavaScript篇

> http://www.cnblogs.com/coco1s/p/4029708.html

## 5个典型的JavaScript面试题 √
* 问题1：作用域: `(function() { var a = b = 5;})(); console.log(b);`, 请问控制台上会输出什么？
	+ 5
* 问题2：创建"内置"方法: 给String对象定义一个repeatify方法。该方法接收一个整数参数，作为字符串重复的次数，最后返回重复指定次数的字符串。
	例如：`console.log('hello'.repeatify(3));` 输出应该是 `hellohellohello`
	* 答：
	`String.prototype.repeatify = String.prototype.repeatify || function(times) {
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

## 代码题 √

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

## 一些JS题目的解答(考察作用域和变量提升、this指向) √
> https://github.com/xufei/blog/blob/master/posts/2013-12-02-%E4%B8%80%E4%BA%9BJS%E9%A2%98%E7%9B%AE%E7%9A%84%E8%A7%A3%E7%AD%94.md

## 前端开发面试题
> 前端开发面试题 https://github.com/markyun/My-blog/tree/master/Front-end-Developer-Questions/Questions-and-Answers
> 史上最全 前端开发面试问题及答案整理 https://github.com/allenGKC/Front-end-Interview-questions
> 收集的前端面试题和答案 https://github.com/qiu-deqing/FE-interview
> 前端开发面试题 https://segmentfault.com/a/1190000000465431

## ele面试 JavaScript 基础问题
> https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/common.md

## ele面试 Network
> https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/network.md

## HTTP 协议入门 
> http://www.ruanyifeng.com/blog/2016/08/http.html

## TCP协议小结 https://segmentfault.com/a/1190000013342156

## 理解RESTful架构
> http://www.ruanyifeng.com/blog/2011/09/restful.html

## 面试前端工程师
> https://github.com/paddingme/Front-end-Web-Development-Interview-Question/blob/master/interview/1.md

## 2017-08面试总结 
> https://github.com/sunyongjian/blog/issues/32

## 十大经典排序算法总结（JavaScript描述） 
>  学习JavaScript数据结构与算法
>  https://juejin.im/post/57dcd394a22b9d00610c5ec8
>  ES6的数据结构与算法 https://www.talkingcoder.com/article/6374220543809234154

## 设计模式
> JavaScript设计模式与开发实践
> https://segmentfault.com/a/1190000004568177

## FEX 面试问题 
> https://github.com/fex-team/interview-questions

## 我遇到的前端面试题2017 
> https://segmentfault.com/a/1190000011091907
## 从输入URL到页面加载发生了什么？ 
> https://segmentfault.com/a/1190000006879700
## 更快更安全，HTTPS 优化总结 
> https://segmentfault.com/a/1190000013380916
## 12个HTML和CSS必须知道的重点难点问题 
> https://segmentfault.com/a/1190000013375700
## 50道CSS基础面试题（附答案） 
> https://segmentfault.com/a/1190000013325778
## 面试的信心来源于过硬的基础  
> https://segmentfault.com/a/1190000013331105
## 实现一个算法，寻找字符串中出现次数最少的、并且首次出现位置最前的字符。 
> https://segmentfault.com/q/1010000008703575
## ajax跨域，这应该是最全的解决方案了 
> https://segmentfault.com/a/1190000012469713