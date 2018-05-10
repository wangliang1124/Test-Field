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
  + 创建
    + DOM对象初始化时会在创建默认的基本property；
    + 只有在HTML标签中定义的attribute才会被保存在property的attributes属性中；
    + attribute会初始化property中的同名属性，但自定义的attribute不会出现在property中；
    + attribute的值都是字符串；
  + 数据绑定
    + attributes的数据会同步到property上，然而property的更改不会改变attribute；
    + 对于value，class这样的属性/特性，数据绑定的方向是单向的，attribute->property；
    + 对于id而言，数据绑定是双向的，attribute<=>property；
    + 对于disabled而言，property上的disabled为false时，attribute上的disabled必定会并存在，此时数据绑定可以认为是双向的；
  + 使用
    + 可以使用DOM的setAttribute方法来同时更改attribute；
    + 直接访问attributes上的值会得到一个Attr对象，而通过getAttribute方法访问则会直接得到attribute的值；

> DOM 中 Property 和 Attribute 的区别 https://www.cnblogs.com/elcarim5efil/p/4698980.html

* 21.Difference between document load event and document DOMContentLoaded event? [基础]
  + load event是网页上所以资源加载完毕才执行，只能有一个
  + DOMContentLoaded: dom标签加载完毕后即可执行（css、image、iframe还没有加载完）
  + The DOMContentLoaded event is fired when the document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading (the load event can be used to detect a fully-loaded page).

  > DOMContentLoaded https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded <br>
  > DOMContentLoaded与load的区别 https://www.cnblogs.com/caizhenbo/p/6679478.html

* 22.== 和 === 有什么不同？ [基础]
  + '==' 宽松相等，允许在相等比较中进行强制类型转换
  + '===' 是严格相等，不允许强制类型转换，注意：+0 === -0
  + '=='转换规则：
    + 1. 字符串和数字之间的相等比较，字符串转换为数字
    + 2. 其他类型和布尔类型之间的相等比较，布尔值会先被转换成数字，true => 1, false => 0
    + 3. null 和undefined 之间的相等比较, null == undefined // =>true, 除此之外其他值都不存在这种情况。
    + 4. 对象和非对象之间的相等比较, 把对象转换为原始值(valueOf(), toString())
    + 5. NaN不等于任何值，包括自己 NaN == NaN // => false
    + 6. 两个对象指向同一个值时即视为相等，不发生强制类型转换。
  + 两个原则：
    + 如果两边的值中有true 或者false，千万不要使用==。
    + 如果两边的值中有[]、"" 或者0，尽量不要使用==。

* 23.你如何从浏览器的 URL 中获取查询字符串参数。 [进阶]
  ```javascript
    var qs = (function(queryString){
      var q = queryString.substring(1).split('&')
      if(q == '') return {};
      var result = {};
      for(var i = 0 ; i < q.length; i++) {
        var arr = q[i].split('=');
        result[arr[0]] = arr[1] ? decodeURIComponent(arr[1].replace(/\+/g, ' ')) : '';
      }
      return result;
    })(window.location.search)
  ```

* 24.请解释一下 JavaScript 的同源策略。如何解决跨域问题?  [进阶]
  + 同源：同协议、 同域名、 同端口
  + 同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。
  + 限制范围:(1)Cookie、LocalStorage 和 IndexDB 无法读取。(2)DOM 无法获得。(3)AJAX 请求不能发送。

> 浏览器同源政策及其规避方法 http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html <br>
> ajax跨域，这应该是最全的解决方案了 https://segmentfault.com/a/1190000012469713 <br>
> 两种跨站攻击方式——XSS和CSRF https://blog.csdn.net/u013736932/article/details/78805397 

* 25.描述一种 JavaScript 中实现 memoization(避免重复运算)的策略。[进阶]

> 从斐波那契数列求值优化谈 _.memoize 方法 https://github.com/hanzichi/underscore-analysis/issues/23 <br>
> 斐波那契数列求和的js方案以及优化 https://segmentfault.com/a/1190000007115162 <br>
> 性能优化：memoization http://taobaofed.org/blog/2016/07/14/performance-optimization-memoization/  <br>
> Faster JavaScript Memoization For Improved Application Performance https://addyosmani.com/blog/faster-javascript-memoization/ <br>


* 26.什么是三元表达式？“三元” 表示什么意思？[基础]
  + condition ? expr1 : expr2 ，三个操作数
  + 如果条件值为真值（true），运算符就会返回expr1的值；否则，返回 expr2 的值

* 27.函数的参数元是什么？[基础]
  + arguments对象
  ```javascript
  var log = function() {
    var args = Array.prototype.slice.call(arguments) // 转换为真正的数组
    args.unshift('(app) ')
    console.log.apply(console,args)
  }
  log('sss')
  ```
  > Arguments 对象 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments

* 28.什么是 "use strict"? 使用它的好处和坏处分别是什么？ [基础]
  + 严格模式消除了一些 JavaScript的静默错误，通过改变它们来抛出错误。
  + 严格的模式修复了 JavaScript引擎难以执行优化的错误：有时候，严格模式代码可以比非严格模式的相同的代码运行得更快。
  + 严格模式禁用了在ECMAScript的未来版本中可能会定义的一些语法。

  > 严格模式 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode

* 29.在什么时候你会使用 document.write()？
  + 加载脚本，相比document.createElement('script')，少几行代码，也更快
  + 加载第三方广告
  + document.write() 接收一个字符串作为参数，将该字符串写入文档流中。一旦文档流已经关闭（document.close()），那么 document.write 就会重新利用 document.open() 打开新的文档流并写入，此时原来的文档流会被清空，已渲染好的页面就会被清除，浏览器将重新构建 DOM 并渲染新的页面。

  > document.write 的痛 https://zhuanlan.zhihu.com/p/33983842 <br>
  > document.write知多少 https://segmentfault.com/a/1190000006197157 <br>
  > 闲扯 『 document.write 』 http://www.cnblogs.com/zichi/p/5303541.html

* 30.请指出浏览器特性检测，特性推断和浏览器 UA 字符串嗅探的区别？ [基础]
  + 特性检测：
    ```javascript
    function getElement(id){
      if (document.getElementById){
        return document.getElementById(id);
      } else if (document.all){
        return document.all[id];
      } else {
        throw new Error("No way to retrieve element!");
      }
    }
    ```
  + 特性推断(不可靠):
    ```javascript
    function getWindowWidth(){
      if (document.all){ //假设是IE, 实际上，也可能是Opera；Opera 支持document.all
        return document.documentElement.clientWidth; //错误的用法！！！
      } else {
        return window.innerWidth;
      }
    }
    ```
  + UA字符串嗅探:
    ```javascript
    if (navigator.userAgent.indexOf("MSIE 7") > -1){
      //do something
    }
    ```

* 31.使用 Ajax 都有哪些优劣？ [基础]
  * 优势
    + 无刷新在页面与服务器通信，更新页面，用户体验好。
    + 异步与服务器通信，不需要打断用户的操作，具有更加迅速的响应能力。
    + 前端和后端负载平衡。可以把以前一些服务器负担的工作转嫁到客户端，利用客户端闲置的能力来处理，减轻服务器和带宽的负担，节约空间和宽带租用成本。并且减轻服务器的负担，ajax的原则是“按需取数据”，可以最大程度的减少冗余请求，和响应对服务器造成的负担。
    + 界面与应用分离：Ajax使WEB中的界面与应用分离（也可以说是数据与呈现分离），有利于分工合作、减少非技术人员对页面的修改造成的WEB应用程序错误、提高效率、也更加适用于现在的发布系统。
    + 基于标准化的并被广泛支持的技术，不需要下载插件或者小程序。
  * 缺点：
    + AJAX干掉了Back和History功能，即对浏览器机制的破坏。
    + AJAX的安全问题:Ajax技术就如同对数据建立了一个直接通道，使得开发者在不经意间会暴露比以前更多的数据和服务器逻辑。Ajax也难以避免一些已知的安全弱点，诸如跨站点脚步攻击、SQL注入攻击和基于Credentials的安全漏洞等等
    + 对搜索引擎支持较弱。
    + 客户端过肥，太多客户端代码造成开发上的成本。
    + 违背URL和资源定位的初衷,采用了Ajax技术，也许你在该URL地址下面看到的和我在这个URL地址下看到的内容是不同的

* 32.Why is it, in general, a good idea to leave the global scope of a website as-is and never touch it? [基础]
  + 安全，变量直接暴露在全局，任何人都可能修改
  + 减少名称冲突
  + 利于模块化
  + 优雅

* 33.Why would you use something like the load event? Does this event have disadvantages? Do you know any alternatives, and why would you use those? [基础]
  + load event tells browser to do something only after everthing including frames, images, asynchronous JavaScripts are fully loaded.
  + If you want event function to execute before fully loaded frames, images, async scripts, use DOMContentLoaded instead.

* 34.Explain what a single page app is and how to make one SEO-friendly. [基础]
  + 所有的页面都在一个主页面上呈现；不用刷新整个页面
  + 服务器渲染

  > Vue.js 服务器端渲染指 https://ssr.vuejs.org/zh/

* 35.What is the extent of your experience with Promises and/or their polyfills?  [基础]
  ```javascript
    new Promise((resolve, reject) => {
      if (resolve) {
        resolve('success')；
      } else {
        reject('failed')
      }
    }).then((result) => {
        console.log(result)
    })
  ```
  + polyfill: bluebird

  > JavaScript Promise：简介 https://developers.google.com/web/fundamentals/primers/promises
  > Promise https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise

* 36.What tools and techniques do you use debugging JavaScript code?  [基础
  + Chrome Dev Tools.

* 37.What language constructions do you use for iterating over object properties and array items? [基础]
  + Array
    + for
    + forEach\every\some\filter\map
  + Object
    + for(var key in obj) { if(obj.hasOwnProperty(key)){ // 过滤不可枚举属性 } } 
    + Object.keys(obj).forEach

* 38.Explain the difference between mutable and immutable objects. [进阶]
  * What is an example of an immutable object in JavaScript?
  * What are the pros and cons of immutability?
  * How can you achieve immutability in your own code?

> Mutable object means its state is allowed to be changed over time. Immutable object's value doesn't change from the time it was created.

> Immutable examples are primitive types like String, Number. You can't change the definition of 2 after executing 2 + 5. No matter how you operate strings, the definition of c won't change.

> Mutable examples are array, object or anything opposite to immutability. You can change the value of an array or object anytime and the result will be what you desired.

> Immutable object won't be changed after it has been initialized. We can take advantage of this. Making immutable objects into a collection of cache since these objects don't change at all. Our program is actually accessing the same data. This is a good approach to saving memory by taking advantage of immutable. The downside of immutability is that it actually involving constantly deep clone and assigning. This is an overhead of trading computing speed for memory.

> To achieve immutability on array or object or any type you want, you have to do deep clone, or simply use library like immutable.js developed by Facebook.

> facebook immutable.js 意义何在，使用场景？ https://www.zhihu.com/question/28016223


* 39.Explain the difference between synchronous and asynchronous functions. [基础]
  + 同步是阻塞的，异步是非阻塞的
  ```javascript
  function blocking(){
    console.log("1");
    console.log("2");
  }
  function nonBlocking(){
      setTimeout(function(){
          console.log("1");
      }, 1000);
      console.log("2");
  }
  ```

> Asynchronous vs synchronous execution, what does it really mean?
https://stackoverflow.com/questions/748175/asynchronous-vs-synchronous-execution-what-does-it-really-mean


* 40.What is event loop? What is the difference between call stack and task queue? [进阶]

  + Event loop is how JavaScript with single-threaded performs tasks without blocking.

  + Event loop is a queue of callback functions. When a asynchronous function executes, it is pushed into task queue and JavaScript will only start processing task queue after codes after async function are executed.

  + The difference between call stack and task queue is that task queue is a place where JavaScript schedules async function while call stack is a place for JavaScript to trace what the current function is.

> JavaScript：彻底理解同步、异步和事件循环(Event Loop) https://segmentfault.com/a/1190000004322358
> Concurrency model and Event Loop https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
> JavaScript Event Loop Explained https://medium.com/front-end-hacking/javascript-event-loop-explained-4cd26af121d4
> JavaScript 运行机制详解：再谈Event Loop  http://www.ruanyifeng.com/blog/2014/10/event-loop.html

* 41.Explain the differences on the usage of foo between function foo() {} and var foo = function() {}  [基础]
  + 函数声明在JS解析时进行函数提升，因此在同一个作用域内，不管函数声明在哪里定义，该函数都可以进行调用。而函数表达式的值是在JS运行时确定，并且在表达式赋值完成后，该函数才能调用。
  + 创建函数的三种方式：
    + function sum (num1, num2) { return num1 + num2; } 
    + var sum = function(num1, num2) { return num1 + num2 }
    + var sum = new Function('num1', 'num2', 'return num1 + num2')
  > 前端程序员经常忽视的一个JavaScript面试题 https://github.com/Wscats/Good-Text-Share/issues/85

* 42.What are the differences between variables created using let, var or const? [基础]
  
  > var、let、const 区别？ https://www.jianshu.com/p/4e9cd99ecbf5

* 43.箭头函数，解构赋值，字符串模版，扩展符  [基础]

  > ECMAScript 6 入门 http://es6.ruanyifeng.com/

* 44.What is the definition of a higher-order function?  [进阶]
  + 《JavaScript设计模式与开发实践》3.2 高阶函数
  
  > JavaScript高阶函数的应用 https://segmentfault.com/a/1190000012008266

* 45.Can you give an example of a curry function and why this syntax offers an advantage? [进阶]

 > JavaScript专题之函数柯里化 https://github.com/mqyqingfeng/Blog/issues/42

* 46.请实现一个遍历至 100 的 for loop 循环，在能被 3 整除时输出 "fizz"，在能被 5 整除时输出 "buzz"，在能同时被 3 和 5 整除时输出 "fizzbuzz"。 [基础]
 ```javascript
 for(var i = 0; i <= 100; i++) {
   if(i % 3 === 0) console.log( i + 'fizz')
   if(i % 5 === 0) console.log(i + 'buzz')
   if(i % 3 === 0 && i % 5 === 0) console.log(i + 'fizzbuzz')
 }
 ```

* 47.What are the pros and cons of using Promises instead of callbacks?  [进阶]
 + 地狱回掉
 + 信任
 + 错误处理

> Promise原理浅析 http://imweb.io/topic/565af932bb6a753a136242b0
> 解读Promise内部实现原理 https://juejin.im/post/5a30193051882503dc53af3c#heading-0


## 参考资料
> JS 相关问题 https://github.com/h5bp/Front-end-Developer-Interview-Questions/blob/master/Translations/Chinese/README.md#js-questions
> JS Questions https://github.com/h5bp/Front-end-Developer-Interview-Questions/blob/master/questions/javascript-questions.md <br>
> 答案： https://github.com/infp/Front-end-Interview/blob/master/faq/javascript.md <br>
> JS面试题答案整理 https://github.com/sunyongjian/blog/issues/23 <br>
> 答案：Front-end Job Interview Questions http://andrewyan.logdown.com/posts/643979-front-end-job-interview-questions <br>

