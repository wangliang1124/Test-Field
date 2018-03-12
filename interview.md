# JS
* 1.解释下事件代理
* 2.解释下 JavaScript 中 this 是如何工作的。
* 3.解释下原型继承的原理。
* 4.什么是哈希表？
	* A: 哈希表是根据关键字（Key value）而直接访问在内存存储位置的数据结构。也就是说，它通过把键值通过一个函数的计算，映射到表中一个位置来访问记录，这加快了查找速度。这个映射函数称做散列函数，存放记录的数组称做散列表
* 5.解释下为什么接下来这段代码不是 IIFE(立即调用的函数表达式)：function foo(){ }();.
* 6.描述以下变量的区别：null，undefined 或 undeclared？
* 7.什么是闭包，如何使用它，为什么要使用它？
* 8.请举出一个匿名函数的典型用例？
* 9.解释 “JavaScript 模块模式” 以及你在何时使用它。
* 10.你是如何组织自己的代码？是使用模块模式，还是使用经典继承的方法？
* 11.请指出 JavaScript 宿主对象和原生对象的区别？
	* A: 宿主对象是指DOM和BOM。原生对象是Object、Function、Array、String、Boolean、Number、Date、RegExp、Error、Math等对象
* 12.Difference between: function Person(){}, var person = Person(), and var person = new Person()?
* 12.call 和 .apply 的区别是什么？
* 13.请解释 Function.prototype.bind 的作用？
* 14.你能解释一下 JavaScript 中的继承是如何工作的吗？
* 15.请尽可能详尽的解释 AJAX 的工作原理。
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
> https://github.com/paddingme/Front-end-Web-Development-Interview-Question/blob/master/questions/7.md
> 答案： https://github.com/infp/Front-end-Interview/blob/master/faq/javascript.md

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