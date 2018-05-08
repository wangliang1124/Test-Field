# JS

* 1.解释下事件代理(事件委托delegation)  [基础]
  + 解释：利用事件冒泡的原理，把多个子元素的事件及事件处理函数，委托给父元素统一处理。
  + 用处：减少了事件绑定和删除，减少dom交互，减少内存占用，提高性能。
  + 比喻：类似于公司前台代收快递
  + 例如：为父节ul点添加一个click事件监听，当子节点li被点击的时候，click事件会从子节点开始向上冒泡。   父节点捕获到事件之后，通过判断(e.target || e.srcElement(兼容ie)).nodeName来判断是否为我们需要处理的节点。    并且通过e.target拿到了被点击的节点。从而可以获取到相应的信息，并作处理。
  + 适合用事件委托的事件：click，mousedown，mouseup，keydown，keyup，keypress。
> JS中的事件委托或是事件代理详解 https://github.com/yonyouyc/blog/issues/25 <br>
>JavaScript事件代理和委托（Delegation） https://www.cnblogs.com/owenChen/archive/2013/02/18/2915521.html

* 2.解释下 JavaScript 中 this 是如何工作的。[基础]
  + this是在函数运行时绑定的，它的值取决于函数的调用位置
  + 在全局环境使用this，它指的就是顶层对象window || module.exports。
  + 如果是被一个对象调用的，则指向这个对象
  + 可以通过call()或apply()强制绑定this
  + 使用new构造一个对象时，this指向新创建的实例对象
  + 箭头函数的this就是父函数所在作用域的this

* 3.解释下原型继承的原理。 [基础]
  + "继承"的说法不准确，因为JS没有父类、子类，类和实例的概念，只有对象
  + 继承的本质是委托，当要访问一个对象obj的属性时，会先在obj上查找,没有的话，再通过在原型链层层遍历的方式查找需要的属性
  + 例如函数Foo()在声明时,会创建一个prototype属性
  + 通过new Foo()，会创建一个新的对象，并有个__proto__的不可枚举属性指向Foo.prototype
  + 这个新的对象实例可以直接调用Foo.prototype的属性（或者说所有new的实例对象都可以继承原型上的属性）
  + 原型链的尽头是Object.prototype
  + 化繁为简: Object.create()
  > 《你不知道的JavaScript上卷，第二部分第5章原型》
  
* 4.什么是哈希表？[进阶]
  * 哈希表就是把Key通过一个特定的算法函数即哈希函数转换成一个整型数字，然后就将该数字对数组长度进行取余，取余结果就当作数组的下标，将value存储在以该数字为下标的数组空间里。
  * 当使用哈希表进行查询的时候，就是再次使用哈希函数将key转换为对应的数组下标，并定位到该地址获取value
  * 优点：速度快，时间复杂度为O(1)。
> How is a JavaScript hash map implemented?
https://stackoverflow.com/questions/8877666/how-is-a-javascript-hash-map-implemented <br>
> 从头到尾彻底解析哈希表算法 https://blog.csdn.net/c602273091/article/details/54799452 <br>
> 浅谈算法和数据结构: 十一 哈希表 http://www.cnblogs.com/yangecnu/p/Introduce-Hashtable.html


* 5.解释下为什么接下来这段代码不是 IIFE(立即调用的函数表达式)：function foo(){ }();要做哪些改动使它变成 IIFE？
  + function关键字开头，函数声明, 无法立即运行
  + 改成表达式才能运行，(function foo(){ }()) 或者 (function foo(){ })()
  + 可以传参,(function foo(global, undefined){ })(window)

* 6.描述以下变量的区别：null，undefined 或 undeclared？ [基础]
  + null：声明了并赋值为null
  + undefined: 声明了但未赋值
  + 比如声明一个变量a，如果还未赋值则表示a引用的值未定义，a = null表示a的值是null，而null表示一个空值
  + null是一个特殊关键字，不是标识符，我们不能将其当作变量来使用和赋值。undefined是一个标识符，可以被当作变量来使用和赋值。
  + null 和 undefined 转换为数字的结果不同: +null => 0, +undefined => NaN
  + undeclared: 变量未声明，作用域里找不到

* 7.什么是闭包，如何使用它，为什么要使用它？ [基础]
  + 函数可以创建一个作用域
  + 在函数外部无法访问函数内部定义的变量
  + 如果在函数内部声明一个函数，这个函数可以访问父函数的作用域，当把这个子函数所引用的函数对象作为值返回时，这个子函数依然持有父函数作用域引用，这个引用就是闭包
  + 可以用在回调函数、高阶函数、立即执行函数、模块化；避免全局污染；

* 8.请举出一个匿名函数的典型用例？
  + 函数的参数(用作回调) var myPromise = new Promise(function(resolve, reject){ })
  + 高阶函数的返回值 function foo(){ return function() {} }
  + 立即执行函数 (function(){ })()
  + 函数表达式 var foo = function() {}

* 9.解释"JavaScript模块模式"以及你在何时使用它。
  + 利用函数作用域和闭包的特点，把一些功能封装(使用立即执行函数)在一个命名空间下
  + 保持内部数据变量是隐藏且私有的状态：外部无法修改；可以避免全局变量污染
  + CommonJS是服务器端模块的规范，Node.js采用了这个规范。Node.JS首先采用了js模块化的概念。根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性。
  + 输出模块变量的最好方法是使用module.exports对象。
  ```javascript
    var i = 1;
    var max = 30;

    module.exports = function () {
      for (i -= 1; i++ < max; ) {
        console.log(i);
      }
      max *= 1.1;
    };
  ```
  + 浏览器模块规范：AMD（异步模块定义），require.js采用的是AMD规范
  + RequireJS解决了两个问题：
   + （1）实现js文件的异步加载，避免网页失去响应；
   + （2）管理模块之间的依赖性，便于代码的编写和维护。

  > 详解JavaScript模块化开发 https://segmentfault.com/a/1190000000733959 <br>
  > CommonJS规范 http://javascript.ruanyifeng.com/nodejs/module.html <br>
  > AMD规范 https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88) <br>
  > CMD 模块定义规范 https://github.com/seajs/seajs/issues/242 <br>
  > Javascript模块化编程（一）：模块的写法 http://www.ruanyifeng.com/blog/2012/10/javascript_module.html

* 10.你是如何组织自己的代码？是使用模块模式，还是使用经典继承的方法？
  + 都有，各有各的适用情境（比如组件、插件）

* 11.请指出 JavaScript 宿主对象和原生对象的区别？ [基础]
  + 宿主对象是指DOM和BOM等，是由宿主框架通过某种机制注册到JavaScript引擎中的对象
  + 原生对象是Object、Function、Array、String、Boolean、Number、Date、RegExp、Error、JSON，Global、Math(内置对象)...，就是ECMA-262定义的引用类型
  + 宿主对象是厂家定义的，可能不会继承Object(因此不会继承相应的属性和方法)

  > https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects

* 12.请指出以下代码的区别： function Person(){}, var person = Person(), and var person = new Person()? [基础]
  + 第一句声明了一个Person函数
  + 第二句声明变量person，调用Person函数并把执行的结果赋值给person
  + 第三句调用Person作为构造函数,new一个新的对象实例，赋值给person

* 13..call 和 .apply 的区别是什么？  [基础]
  + call参数是一个个传递的 func.call(obj, arg1, arg2, arg3....)
  + apply第二个参数是数组形式 func.apply(obj, [arg1,arg2,arg3..])
  + call的执行效率高于apply，apply对参数进行一系列检验和深拷贝

* 14.请解释 Function.prototype.bind 的作用？ [基础]
  + 传入context,args参数, 返回一个函数。这个函数调用时: 把this绑定到给定的context上(闭包的用处), 把args和返回函数的arguments拼接成一个新的数组作为被绑定函数的参数, 相当于 func.apply(context, 新args)
  > https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

* 15.请尽可能详尽的解释AJAX的工作原理。 [进阶]
  + AJAX是一种异步的无须刷新整个页面就可以响应用户交互的技术，也就是说它可以只更新或重载部分页面。
  + AJAX的核心由JavaScript、XMLHTTPRequest、 DOM对象组成，通过XMLHTTPRequest对象向服务器发送HTTP request请求，并监听响应情况，获取数据，并由JS操作DOM更新页面。
  ```javascript
    (function() {
        var httpRequest = new XMLHttpRequest()
        httpRequest.onreadystatechange = handler
        httpRequest.open('get', 'https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started')
        // httpRequest.setRequestHeader('Content-Type', 'text/html;charset=UTF-8')
        httpRequest.send()
        console.log('发送请求')
        function handler() {
            if (httpRequest.readyState === 4) { // XMLHttpRequest.DONE
                if (httpRequest.status === 200) {
                    try {
                      var iframe = document.createElement('<iframe name="ajax">') // 兼容ie
                    } catch (e) {
                      iframe = document.createElement('iframe') // 非ie
                    }
                    iframe.name = 'ajax'
                    iframe.width = '600'
                    iframe.height = '400'
                    document.body.appendChild(iframe)
                    var iframeDocument = iframe.contentDocument || iframe.document
                    iframeDocument.open()
                    iframeDocument.write(httpRequest.responseText)
                    console.log('接收响应')
                }
            }
        }
    })()
    // 以上代码在ie11下有问题
  ```

  > What's AJAX? https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started <br>
  > XMLHttpRequest Level 2 使用指南 http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html <br>
  > XMLHttpRequest https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest <br>
  > 你真的会使用XMLHttpRequest吗？ https://segmentfault.com/a/1190000004322487 

* 16.请解释 JSONP 的工作原理，以及它为什么不是真正的 AJAX。 [基础]
  + 动态创建script标签： var script = document.createElement('script');
  + 设置script元素的src属性为要请求的url, script.src = 'http://www.test.com/?callback=handleResponse';
  + 声明处理函数：function handleResponse(res){ console.log(res) }
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
> 前端模板技术面面观 http://leeluolee.github.io/2014/10/10/template-engine/ <br>
> 浅谈模板引擎 http://www.cnblogs.com/dojo-lzz/p/5518474.html <br>
> 前端模板的原理与实现 https://segmentfault.com/a/1190000006990480
  
* 18.请解释变量声明提升。 [基础]
  + JavaScirpt代码在被解释之前会被编译
  + 在编译阶段，编译器会找到作用域内所有的声明，初始值为undefined
  + 也就是说即使某个变量看起来即使是先赋值后声明的，在内部实际上是在编译阶段声明，在执行阶段赋值
  + 就好像变量或函数声明从它们在代码中的位置被移动到了最上面，这个过程就叫提升

* 19.请描述下事件冒泡机制。 [基础]
  + DOM事件流有三个阶段：捕获阶段、目标阶段、冒泡阶段
  + 事件触发是会从根元素由外向内的传播，直到目标元素
  + 然后事件又从最里层的目标元素，逐层冒泡到最外层，在每层都会触发事件
  + 如果要禁止事件的冒泡，可以在目标元素的事件方法里调用event.stopPropagation()方法

* 20."attribute" 和 "property" 的区别是什么？ [基础]
  + attribute是指HTML标签上的属性，attribute只能是字符串
  + property是指DOM对象的属性
  + 标准的 DOM properties 与 attributes 是同步的

* 21.Difference between document load event and document DOMContentLoaded event? [基础]
  + window.onload是网页上所以资源加载完毕才执行，只能有一个
  + DOMContentLoaded: dom标签加载完毕后即可执行（关联资源还没有加载玩）
  > The DOMContentLoaded event is fired when the document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading (the load event can be used to detect a fully-loaded page).
  > https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded

* 22.== 和 === 有什么不同？ [基础]
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
      for(var i = 0 ; i < q.length; i++) {
        var arr = q[i].split('=');
        result[arr[0]] = arr[1] ? decodeURIComponent(arr[1].replace(/\+/g, ' ')) : '';
      }
      return result;
    })(window.location.search)
  `

* 24.请解释一下 JavaScript 的同源策略。如何解决跨域问题?  [基础]
  + 同源：协议(http\https) 域名(www.baidu.com\map.baidu.com) 端口(80\81)
  + 出于安全的考虑，不允许源a访问源b的资源

> 浏览器同源政策及其规避方法 http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html
> 跨域CORS http://www.ruanyifeng.com/blog/2016/04/cors.html
> ajax跨域，这应该是最全的解决方案了 https://segmentfault.com/a/1190000012469713
> https://stackoverflow.com/questions/11474336/same-origin-policy-in-layman-terms

* 25.描述一种 JavaScript 中实现 memoization(避免重复运算)的策略。[进阶]

> 从斐波那契数列求值优化谈 _.memoize 方法 https://github.com/hanzichi/underscore-analysis/issues/23
> 斐波那契数列求和的js方案以及优化 https://segmentfault.com/a/1190000007115162
> 性能优化：memoization http://taobaofed.org/blog/2016/07/14/performance-optimization-memoization/
> Faster JavaScript Memoization For Improved Application Performance https://addyosmani.com/blog/faster-javascript-memoization/

* 26.什么是三元表达式？“三元” 表示什么意思？[基础]
  + condition ? expr1 : expr2
  + 如果条件值为真值（true），运算符就会返回 expr1 的值；否则， 就会返回 expr2 的值

* 27.函数的参数元是什么？
  + arguments对象
  `var log = function() {
    var args = Array.prototype.slice.call(arguments)
    args.unshift('(app) ')
    // console.log(args)
    console.log.apply(console,args)
  }
  log('sss')
  `

* 28.什么是 "use strict"? 使用它的好处和坏处分别是什么？ [基础]
  + 将使 JS 代码以严格模式（strict mode）运行。使用了较为严格的错误检测条件检测。
  + 消除JavaScript语法的不合理不严谨的地方，减少怪异行为
  + 全局变量的显示声明,函数必须声明在顶层
  + 消除代码运行的不安全之处： eval中不允许声明变量； this始终是指定的值，func.call(null)全局下this转换为window
  + 提高编译效率
  + 为未来的新版本做铺垫： 淘汰了with arguments.caller arguments.callee
  + 坏处： 估计写代码没那么随意了

> 参考： 高程三附录B

* 29.在什么时候你会使用 document.write()？
  + 会重绘整个页面
  + 很少使用，首页loading的时候使用过
  + 广告弹窗
  + 带条件的资源文件的同步加载，比如为了兼容不支持某些特性的浏览器需要加载对应的 Polyfill，但是又考虑到自身本就支持的浏览器，所以要做兼容性检测，只针对不支持的浏览器加载 Polyfill。

  > document.write 的痛 https://zhuanlan.zhihu.com/p/33983842

* 30.请指出浏览器特性检测，特性推断和浏览器 UA 字符串嗅探的区别？ [基础]
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

* 31.使用 Ajax 都有哪些优劣？ [基础]
  * 优势
    + 异步通信，不需要打断用户的操作，具有更加迅速的响应能力。
    + ajax的原则是“按需取数据”，可以最大程度的减少冗余请求，和响应对服务器造成的负担。
  * 缺点：
    + AJAX干掉了Back和History功能，即对浏览器机制的破坏。
    + 对搜索引擎支持较弱。
    + 违背URL和资源定位的初衷,采用了Ajax技术，也许你在该URL地址下面看到的和我在这个URL地址下看到的内容是不同的。

* 31. 请实现一个遍历至 100 的 for loop 循环，在能被 3 整除时输出 "fizz"，在能被 5 整除时输出 "buzz"，在能同时被 3 和 5 整除时输出 "fizzbuzz"。
    `for(var i = 0; i <= 100; i++) {
      if(i % 3 === 0) console.log( i + 'fizz')
      if(i % 5 === 0) console.log(i + 'buzz')
      if(i % 3 === 0 && i % 5 === 0) console.log(i + 'fizzbuzz')
    }
    `
* 32.Why is it, in general, a good idea to leave the global scope of a website as-is and never touch it?
  + 安全，变量直接暴露在全局，任何人都可能修改
  + 减少名称冲突
  + 利于模块化
  + 优雅

* 33.Why would you use something like the load event? Does this event have disadvantages? Do you know any alternatives, and why would you use those?
  + load event tells browser to do something only after everthing including frames, images, asynchronous JavaScripts are fully loaded.
  + If you want event function to execute before fully loaded frames, images, async scripts, use DOMContentLoaded instead.

* 34.Explain what a single page app is and how to make one SEO-friendly.
  + 所有的页面都在一个主页面上呈现；不用刷新整个页面
  + 服务器渲染
  > https://cn.vuejs.org/v2/guide/ssr.html

* 35. What is the extent of your experience with Promises and/or their polyfills?  [基础]
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
  > https://developers.google.com/web/fundamentals/primers/promises
  > https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise

* 35.What are the pros and cons of using Promises instead of callbacks?  [基础]
  + 地狱回掉
  + 信任
  + 错误处理

* 36.What tools and techniques do you use debugging JavaScript code?
  + Chrome Dev Tools.

* 37.What language constructions do you use for iterating over object properties and array items? [基础]
  + Array
    + for
    + forEach\every\some\filter\map
  + Object
    + for(var key in obj) { if(obj.hasOwnProperty(key)){ // 过滤不可枚举属性 } } 
    + Object.keys(obj).forEach

* 38.Explain the difference between mutable and immutable objects.
  * What is an example of an immutable object in JavaScript?
  * What are the pros and cons of immutability?
  * How can you achieve immutability in your own code?

> Mutable object means its state is allowed to be changed over time. Immutable object's value doesn't change from the time it was created.

> Immutable examples are primitive types like String, Number. You can't change the definition of 2 after executing 2 + 5. No matter how you operate strings, the definition of c won't change.

> Mutable examples are array, object or anything opposite to immutability. You can change the value of an array or object anytime and the result will be what you desired.

> Immutable object won't be changed after it has been initialized. We can take advantage of this. Making immutable objects into a collection of cache since these objects don't change at all. Our program is actually accessing the same data. This is a good approach to saving memory by taking advantage of immutable. The downside of immutability is that it actually involving constantly deep clone and assigning. This is an overhead of trading computing speed for memory.

> To achieve immutability on array or object or any type you want, you have to do deep clone, or simply use library like immutable.js developed by Facebook.

> facebook immutable.js 意义何在，使用场景？ https://www.zhihu.com/question/28016223


* 39.Explain the difference between synchronous and asynchronous functions.
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


* 40.What is event loop? What is the difference between call stack and task queue?

> Event loop is how JavaScript with single-threaded performs tasks without blocking.

> Event loop is a queue of callback functions. When a asynchronous function executes, it is pushed into task queue and JavaScript will only start processing task queue after codes after async function are executed.

> The difference between call stack and task queue is that task queue is a place where JavaScrip schedules async function while call stack is a place for JavaScript to trace what the current function is.

> https://segmentfault.com/a/1190000004322358
> https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
> https://medium.com/front-end-hacking/javascript-event-loop-explained-4cd26af121d4
> JavaScript 运行机制详解：再谈Event Loop  http://www.ruanyifeng.com/blog/2014/10/event-loop.html

* 41.Explain the differences on the usage of foo between function foo() {} and var foo = function() {}  [基础]
  + function sum (num1, num2) { return num1 + num2; } 
  + var sum = function(num1, num2) { return num1 + num2 }
  + var sum = new Function('num1', 'num2', 'return num1 + num2')

* 42.What are the differences between variables created using let, var or const? [基础]
  + var、let、const 区别？ 
  > https://www.jianshu.com/p/4e9cd99ecbf5

+ 43.箭头函数，解构赋值，字符串模版，扩展符  [基础]

* 44.What is the definition of a higher-order function? [基础]
 + 《JavaScript设计模式与开发实践》3.2 高阶函数
>  JavaScript高阶函数的应用 https://segmentfault.com/a/1190000012008266

* 45.Can you give an example of a curry function and why this syntax offers an advantage?

# JS
## 1.介绍js的基本数据类型。[基础]
* Boolean,Null,Undefined,Number,String,Symbol (ECMAScript 6 新定义)

## 2.介绍js有哪些内置对象？[基础]
*  Object 是 JavaScript 中所有对象的父对象
* 数据封装类对象：Object、Array、Boolean、Number 和 String
 * 其他对象：Function、Arguments、Math、Date、RegExp、Error
> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects

## 3.说几条写JavaScript的基本规范？
* 使用===/！==比较true/false或数值
* 使用字面量代替new
* 不要使用全局函数
* for/if/while使用大括号
* 变量先声明再使用
* 变量命名以小写字母开头

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
 * JS继承的实现方式 http://www.cnblogs.com/humin/p/4556820.html

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
* http://www.haorooms.com/post/js_EventUtil

## 18.["1", "2", "3"].map(parseInt) 答案是多少？
 * [1, NaN, NaN]

## 19.事件是？IE与火狐的事件机制有什么区别？ 如何阻止冒泡？ [基础]
* IE是事件冒泡、Firefox同时支持两种事件模型，也就是：捕获型事件和冒泡型事件；
 * ev.stopPropagation();（旧ie的方法 ev.cancelBubble = true;）

~~## 20.什么是闭包（closure），为什么要用它？~~
~~## 21.javascript 代码中的"use strict";是什么意思 ? 使用它区别是什么？~~

## 22.如何判断一个对象是否属于某个类？ [基础]
* obj instanceof func, obj.constructor === func, func.prototype.isPrototypeOf(obj)

## 23.new操作符具体干了什么呢? [基础]
`var obj  = {};
 obj.__proto__ = Base.prototype;
 Base.call(obj)`

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
 * defer和async、动态创建DOM方式（用得最多）、按需异步载入js

 > Javascript 异步加载详解 http://www.cnblogs.com/tiwlin/archive/2011/12/26/2302554.html

~~## 28.Ajax 是什么? 如何创建一个Ajax~~

## 29.Ajax解决浏览器缓存问题？
  * 1、在ajax发送请求前加上 anyAjaxObj.setRequestHeader("If-Modified-Since","0")。
  * 2、在ajax发送请求前加上 anyAjaxObj.setRequestHeader("Cache-Control","no-cache")。
  * 3、在URL后面加上一个随机数： "fresh=" + Math.random(); 或 "nowtime=" + new Date().getTime();。

~~## 30.同步和异步的区别?~~  ~~## 31.如何解决跨域问题?~~

## 32.页面编码和被请求的资源编码如果不一致如何处理？ 
## 33.服务器代理转发时，该如何处理cookie？
* HTTP 代理如何正确处理 Cookie https://www.ibm.com/developerworks/cn/java/j-cookie/index.html

## 34.模块化开发怎么做？ 35.AMD（Modules/Asynchronous-Definition）、CMD（Common Module Definition）规范区别？
> 详解JavaScript模块化开发 https://segmentfault.com/a/1190000000733959
> http://www.ruanyifeng.com/blog/2012/10/javascript_module.html

## 36.requireJS的核心原理是什么？（如何动态加载的？如何避免多次加载的？如何 缓存的？）
> requirejs的用法和原理分析 https://github.com/HRFE/blog/issues/10

## 37.JS模块加载器的轮子怎么造，也就是如何实现一个模块加载器？
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

## 44.如何编写高性能的Javascript？

> 编写高性能的Javascript http://www.alloyteam.com/2012/11/performance-writing-efficient-javascript/
> 吹毛求疵的追求优雅高性能JavaScript https://github.com/jawil/blog/issues/2

## 45.那些操作会造成内存泄漏？
> 4种JavaScript内存泄漏浅析及如何用谷歌工具查内存泄露 https://github.com/wengjq/Blog/issues/1
> 4 Types of Memory Leaks in JavaScript and How to Get Rid Of Them https://mp.weixin.qq.com/s/MCmlbI2Z5TAvkCgpqDN4iA

## 46.如何判断当前脚本运行在浏览器还是node环境中？
* typeof global == 'object' && global.global === global

## 48.把 Script 标签放在页面的最底部的body封闭之前 和封闭之后有什么区别？浏览器会如何解析它们？

## 49.移动端的点击事件的有延迟，时间是多久，为什么会有？ 怎么解决这个延时？
> 300 毫秒点击延迟的来龙去脉 https://thx.github.io/mobile/300ms-click-delay

## 51.Underscore 对哪些 JS 原生对象进行了扩展以及提供了哪些好用的函数方法？
## 53.解释一下 Backbone 的 MVC 实现方式？
## 54.什么是“前端路由”?什么时候适合使用“前端路由”? “前端路由”有哪些优点和缺点?
> https://blog.csdn.net/crystal6918/article/details/77432004

## 56.前端templating(Mustache, underscore, handlebars)是干嘛的, 怎么用?
> http://blog.gejiawen.com/2015/04/08/talk-about-fontend-templates/

## 58.检测浏览器版本版本有哪些方式？  [基础]
> https://segmentfault.com/a/1190000007640795

## 59.我们给一个dom同时绑定两个点击事件，一个用捕获，一个用冒泡。会执行几次事件，会先执行冒泡还是捕获？
* 绑定在被点击元素的事件是按照代码顺序发生，其他元素通过冒泡或者捕获“感知”的事件，按照W3C的标准，先发生捕获事件，后发生冒泡事件。所有事件的顺序是：其他元素捕获阶段事件 -> 本元素代码顺序事件 -> 其他元素冒泡阶段事件 。

> https://blog.csdn.net/qiqingjin/article/details/51387217

## 60.使用JS实现获取文件扩展名？
>`function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }`
* '>>>'把数字转换成无无符号整数
> [译]如何更有效的获取文件扩展名 https://segmentfault.com/a/1190000004993946

## 61.Webpack热更新实现原理?
> https://zhuanlan.zhihu.com/p/30623057

## 62.请介绍一下JS之事件节流？什么是JS的函数防抖？ 
> JavaScript 函数节流和函数去抖应用场景辨析  https://github.com/hanzichi/underscore-analysis/issues/20
> underscore 函数去抖的实现  https://github.com/hanzichi/underscore-analysis/issues/21
> underscore 函数节流的实现 https://github.com/hanzichi/underscore-analysis/issues/22

## 63.Object.is() 与原来的比较操作符“ ===”、“ ==”的区别？
* Object.is: Object.is(-0, +0) === false, Object.is(NaN, NaN) === true
* -0 === +0, NaN !== NaN; -0 == +0, NaN != NaN 
> 详解Object.is()与比较操作符===、== https://www.jianshu.com/p/a76dc7e0c5a1

## 64.ES6是如何实现编译成ES5的？
> Babel是如何读懂JS代码的 https://zhuanlan.zhihu.com/p/27289600
> 深入理解Babel原理及其使用，babel把ES6转成ES5的原理是什么？ http://www.fly63.com/article/detial/197

## 65.DOM操作——怎样添加、移除、移动、复制、创建和查找节点。 [基础]
> 深入浅出DOM基础——《DOM探索之基础详解篇》学习笔记 https://github.com/jawil/blog/issues/9

 > JavaScript专题之函数柯里化 https://github.com/mqyqingfeng/Blog/issues/42

> https://github.com/paddingme/Front-end-Web-Development-Interview-Question/blob/master/questions/7.md
> 答案： https://github.com/infp/Front-end-Interview/blob/master/faq/javascript.md
https://github.com/sunyongjian/blog/issues/23
http://andrewyan.logdown.com/posts/643979-front-end-job-interview-questions
我遇到的前端面试题2017 https://segmentfault.com/a/1190000011091907
