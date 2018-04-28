# HTML
## 1.Doctype作用? 严格模式与混杂(兼容)模式如何区分？它们有何意义?
* !DOCTYPE声明位于位于HTML文档中的第一行，处于html标签之前。告知浏览器的解析器用什么文档标准解析这个文档。DOCTYPE不存在或格式不正确会导致文档以兼容模式呈现。
* 如何区分：浏览器解析时到底使用严格模式还是混杂模式，与网页中的 DTD 直接相关。
	+ 1、如果文档包含严格的 DOCTYPE ，那么它一般以严格模式呈现。（严格 DTD ——严格模式） 
	+ 2、包含过渡 DTD 和 URI 的 DOCTYPE ，也以严格模式呈现，但有过渡 DTD 而没有 URI （统一资源标识符，就是声明最后的地址）会导致页面以混杂模式呈现。（有 URI 的过渡 DTD ——严格模式；没有 URI 的过渡 DTD ——混杂模式） 
	+ 3、DOCTYPE 不存在或形式不正确会导致文档以混杂模式呈现。（DTD不存在或者格式不正确——混杂模式）
	+ 4、HTML5 没有 DTD ，因此也就没有严格模式与混杂模式的区别，HTML5 有相对宽松的语法，实现时，已经尽可能大的实现了向后兼容。（ HTML5 没有严格和混杂之分）
> Doctype作用？严格模式与混杂模式如何区分？它们有何差异？ http://www.cnblogs.com/wuqiutong/p/5986191.html
> Doctype作用？严格模式与混杂模式如何区分？它们有何意义？ https://www.jianshu.com/p/3d64e598d27b

## 2.说说你对语义化的理解？(什么是语义化的HTML?)
* html语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；
* 即使没有CSS样式也以一种文档格式显示，并且是容易阅读的。
* 利于搜索引擎的根据标记来确定上下文和各个关键字的权重，利于 SEO。
* 源代码更易读，便于阅读维护理解。
> 什么是语义化的HTML?有何意义？为什么要做到语义化？ http://www.cnblogs.com/wuqiutong/p/5986220.html

## 3.你知道多少种Doctype文档类型？
* HTML 5 <!DOCTYPE html>
* HTML 4.01 规定了三种文档类型：Strict、Transitional 以及 Frameset。
* XHTML 1.0 规定了三种 XML 文档类型：Strict、Transitional 以及 Frameset。
* Standards （标准）模式（也就是严格呈现模式）用于呈现遵循最新标准的网页，而 Quirks（怪癖）模式（也就是松散呈现模式或者兼容模式）用于呈现为传统浏览器而设计的网页。

> DOCTYPE的作用：文档类型与浏览器模式 http://harttle.land/2016/01/22/doctype.html


## 4.HTML与XHTML有什么区别?
* 1.所有的标记都必须要有一个相应的结束标记
* 2.所有标签的元素和属性的名字都必须使用小写
* 3.所有的XML标记都必须合理嵌套
* 4.所有的属性必须用引号""括起来
* 5.把所有<和&特殊符号用编码表示
* 6.给所有属性赋一个值
* 7.不要在注释内容中使"--"
* 8.图片必须有说明文字

## 5.HTML5 为什么只需要写`<!DOCTYPE html>`？
 * HTML5 不基于 SGML，因此不需要对DTD进行引用，但是需要doctype来规范浏览器的行为
 * HTML4.01基于SGML,所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型。

## 6.常见兼容性问题？

> CSS常见兼容性问题总结 http://www.cnblogs.com/imwtr/p/4340010.html

> IE6 浏览器常见兼容问题 大汇总（23个） http://blog.163.com/hongshaoguoguo@126/blog/static/18046981201371611543769/

## 7.html5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分 HTML 和 HTML5？
### HTML5 现在已经不是 SGML 的子集，主要是关于图像，位置，存储，多任务等功能的增加。
* 绘画 canvas
* 用于媒介回放的 video 和 audio 元素
* 本地离线存储 localStorage 长期存储数据，浏览器关闭后数据不丢失；
* sessionStorage 的数据在浏览器关闭后自动删除
* 语意化更好的内容元素，比如 article、footer、header、nav、section
* 表单控件，calendar、date、time、email、url、search
* 新的技术webworker, websockt, Geolocation
### 移除的元素
* 纯表现的元素：basefont，big，center，font, s，strike，tt，u；
* 对可用性产生负面影响的元素：frame，frameset，noframes；
### 支持HTML5新标签：
* IE8/IE7/IE6支持通过document.createElement方法产生的标签，然后添加标签默认的样式：
> HTML5 简介（一）：新的写法、元素及兼容性 https://www.renfei.org/blog/html5-introduction-1.html

## 8.iframe的缺点？
* iframe会阻塞主页面的Onload事件；
* 搜索引擎的检索程序无法解读这种页面，不利于SEO;
* iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
* 使用iframe之前需要考虑这两个缺点。如果需要使用iframe，最好是通过javascript动态给iframe添加src属性值，这样可以绕开以上两个问题。
> iframe异步加载技术及性能 http://www.cnblogs.com/beiyuu/archive/2011/07/18/iframe-tech-performance.html

## 9.如何实现浏览器内多个标签页之间的通信?

> 多个标签页之间的通信 https://segmentfault.com/q/1010000006664804

> Storage事件无法触发解决 https://blog.csdn.net/jlin991/article/details/55855524

## 10.webSocket如何兼容低浏览器？
* Adobe Flash Socket 、 ActiveX HTMLFile (IE) 、 基于 multipart 编码发送 XHR 、 基于长轮询的 XHR

> WebSocket 教程 http://www.ruanyifeng.com/blog/2017/05/websocket.html

> WebSocket兼容到低版本浏览器 https://www.web-tinker.com/article/20324.html

> WebSocket 详解 https://segmentfault.com/a/1190000012948613

## 19.介绍一下你对浏览器内核的理解？常见的浏览器内核有哪些？
* 主要分成两部分：渲染引擎(layout engineer或Rendering Engine)和JS引擎。
* 渲染引擎：负责取得网页的内容（HTML、XML、图像等等）、整理讯息（例如加入CSS等），以及计算网页的显示方式，然后会输出至显示器或打印机。浏览器的内核的不同对于网页的语法解释会有不同，所以渲染的效果也不相同。所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核。
* JS引擎则：解析和执行javascript来实现网页的动态效果。
* 最开始渲染引擎和JS引擎并没有区分的很明确，后来JS引擎越来越独立，内核就倾向于只指渲染引擎。
### 常见内核
* IE: trident内核
* Firefox：gecko内核
* Safari：webkit内核
* Opera：以前是presto内核，Opera现已改用Google Chrome的Blink内核
* Chrome：Blink(基于webkit，Google与Opera Software共同开发)
> http://www.cnblogs.com/fullhouse/archive/2011/12/19/2293455.html

## 20.HTML5的离线储存怎么使用，工作原理能不能解释一下？浏览器是怎么对HTML5的离线储存资源进行管理和加载的呢？
> HTML5 离线缓存-manifest简介 http://yanhaijing.com/html/2014/12/28/html5-manifest/

> HTML5离线存储 初探 http://www.cnblogs.com/chyingp/archive/2012/12/01/explore_html5_cache.html

> 有趣的HTML5：离线存储 https://segmentfault.com/a/1190000000732617

## 22.请描述一下 cookies，sessionStorage 和 localStorage 的区别？
> 详说 Cookie, LocalStorage 与 SessionStorage http://jerryzou.com/posts/cookie-and-web-storage/

## 23.Label的作用是什么？是怎么用的？
> Html中Label标记的作用和使用介绍 http://www.cnblogs.com/meil/archive/2008/01/04/1025922.html

## 24.HTML5的form如何关闭自动完成功能？
> HTML5的form如何关闭自动完成功能 https://blog.csdn.net/shangazhe/article/details/74984282

## 25.页面可见性（Page Visibility API） 可以有哪些用途？

> HTML5页面可见性接口应用 https://www.helloweba.net/javascript/390.html

> Page Visibility(页面可见性) API介绍、微拓展  http://www.zhangxinxu.com/wordpress/2012/11/page-visibility-api-introduction-extend/

> Page Visibility API https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API

## Web Worker
> web worker详解 http://xgfe.github.io/2017/05/03/LexHuang/web-worker/

> 深入 HTML5 Web Worker 应用实践：多线程编程 https://www.ibm.com/developerworks/cn/web/1112_sunch_webworker/

> Web Worker 是什么鬼？ http://www.cnblogs.com/zichi/p/4954328.html

## PostMessage
> html5 API postMessage跨域详解 http://blog.xieliqun.com/2016/08/25/postMessage-cross-domain/

> HTML5 postMessage 跨域交换数据 http://www.cnblogs.com/zichi/p/4638096.html

> Window.postMessage() https://developer.mozilla.org/en-US/docs/Web/API/Window

## 更好的逐帧动画函数 — requestAnimationFrame 简介
> http://www.cnblogs.com/zichi/p/5208171.html
> 浅析 requestAnimationFrame https://taobaofed.org/blog/2017/03/02/thinking-in-request-animation-frame/

## HTML5 File API — 让前端操作文件变的可能
> http://www.cnblogs.com/zichi/p/html5-file-api.html
> HTML5 — 让拖放变的流行起来 http://www.cnblogs.com/zichi/p/5080147.html

## 让 HTML5 来为你定位
> http://www.cnblogs.com/zichi/p/4975788.html

## 浏览器缓存知识小结及应用
> https://www.cnblogs.com/lyzg/p/5125934.html

## 使用css实现一个持续的动画效果
> http://www.cnblogs.com/gaoxuerong123/p/8540554.html

## 40个重要的HTML5面试题及答案
> http://blog.jobbole.com/78346/#q2

# CSS
## 1.介绍一下标准的CSS的盒子模型？低版本IE的盒子模型有什么不同的？
* 标准盒子模型：宽度=内容的宽度（content）+ border + padding + margin
* 低版本IE盒子模型：宽度=内容宽度（content+border+padding）+ margin

> 盒模型 https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model

> 介绍一下标准的CSS的盒子模型？与IE的盒子模型有什么不同的？ https://github.com/ivanberry/CSS-Knowledge/issues/3

> css3 box-sizing详解 https://www.cnblogs.com/iflygofy/p/6323275.html

## 2.CSS选择符有哪些？哪些属性可以继承？
* CSS选择符：id选择器(#myid)、类选择器(.myclassname)、标签选择器(div, h1, p)、相邻选择器(h1 + p)、子选择器（ul > li）、后代选择器（li a）、通配符选择器（\*）、属性选择器（a[rel="external"]）、伪类选择器（a:hover, li:nth-child）
* 可继承的属性：font-size, font-family, color
* 不可继承的样式：border, padding, margin, width, height
* 优先级（就近原则）：!important > [ id > class > tag ] 
* !important 比内联优先级高

> CSS 选择器参考手册 http://www.w3school.com.cn/cssref/css_selectors.asp

> CSS选择器笔记 http://www.ruanyifeng.com/blog/2009/03/css_selectors.html

> css中可以和不可以继承的属性  http://blog.163.com/yhwwen@126/blog/static/170468853201326421822/

## 3.CSS优先级算法如何计算？
* !important > 内联 > id > 类 > 标签|伪类|属性 > 伪元素 > 通配符 > 继承
> css优先级计算规则 http://www.cnblogs.com/wangmeijian/p/4207433.html
> 优先级是如何计算的？ https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity

## 4.CSS3新增伪类有那些？
* p:first-of-type 选择属于其父元素的首个元素
* p:last-of-type 选择属于其父元素的最后元素
* p:only-of-type 选择属于其父元素唯一的元素
* p:only-child 选择属于其父元素的唯一子元素
* p:nth-child(2) 选择属于其父元素的第二个子元素
* :enabled :disabled 表单控件的禁用状态。
* :checked 单选框或复选框被选中。

## 5.如何居中div？
### 内联元素居中方案
#### 水平居中设置：
1. 行内元素: 设置 text-align:center；
2. Flex布局: 设置display:flex;justify-content:center;(灵活运用,支持Chroime，Firefox，IE9+)

#### 垂直居中设置：
1. 单行文本
* 如果父元素有height，设置line-height与height相等即可。 如果没有height, 设置一个line-height即可。
2. 多行文本或图片
* a:父元素设置line-height，子元素display: inline-block，vertical-align:middle；line-height: 1
* b:添加一个空标签用于撑开父元素，子元素同上。

### 块级元素居中方案
#### 水平居中设置：
1. 定宽块状元素
* 设置 左右 margin 值为 auto；
2. 不定宽块状元素
* a:在元素外加入 table 标签（完整的，包括 table、tbody、tr、td），该元素写在 td 内，然后设置 margin 的值为 auto；
* b:给该元素设置 display:inline-block, 注意空白间距问题 letter-spacing: -4px;
* c:利用Transforms，top: 50%; left: 50%; transform: translate(-50%,-50%)

#### 垂直居中设置：
* 使用position:absolute（fixed）,父元素postion:relative, 子元素设置 margin: auto;  position: absolute;  top: 0; left: 0; bottom: 0; right: 0;  
* 定宽高，负外边距margin
* 使用css3的新属性transform:translate(x,y)属性;
* 利用display:table-cell属性使内容垂直居中;
* 当做行内元素处理display:inline-block,使用:before元素;

> 盘点8种CSS实现垂直居中水平居中的绝对定位居中技术 https://blog.csdn.net/freshlover/article/details/11579669

> css实现垂直居中6种方法 http://www.cnblogs.com/Yirannnnnn/p/4933332.html http://www.cnblogs.com/yugege/p/5246652.html

> 六种实现元素水平居中https://www.w3cplus.com/css/elements-horizontally-center-with-css.html

## 6.display有哪些值？说明他们的作用。
* block       	块类型。默认宽度为父元素宽度，可设置宽高，换行显示。
* none        	此元素不显示
* inline      	行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。
* inline-block  默认宽度为内容宽度，可以设置宽高，同行显示。
* list-item   	象块类型元素一样显示，并添加样式列表标记。
* table       	此元素会作为块级表格来显示。
* inherit     	规定应该从父元素继承 display 属性的值。
> https://blog.csdn.net/sjinsa/article/details/70820204

## 7.position的值relative和absolute定位原点是？
* static（默认）：按照正常文档流进行排列（忽略 top, bottom, left, right z-index 声明）
* relative（相对定位）：不脱离文档流，参考自身静态位置通过 top, bottom, left, right 定位；
* absolute(绝对定位)：参考距其最近一个不为static的父级元素通过top, bottom, left, right 定位；
* fixed(固定定位)：所固定的参照对像是可视窗口。

## 8.CSS3有哪些新特性？
> 深入了解 CSS3 新特性 https://www.ibm.com/developerworks/cn/web/1202_zhouxiang_css3/	

## 9.请解释一下CSS3的Flexbox（弹性盒布局模型）,以及适用场景？
> Flex 布局教程：语法篇 http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

> Flex 布局教程：实例篇 http://www.ruanyifeng.com/blog/2015/07/flex-examples.html

## 10.用纯CSS创建一个三角形的原理是什么？
* 把元素的宽度、高度设为0。设置边框样式。 上、左、右三条边隐藏掉（颜色设为 transparent）
  #demo {
    width: 0;
    height: 0;
    border-width: 20px;
    border-style: solid;
    border-color: transparent transparent red transparent;
  }

## 11.一个满屏'品'字布局如何设计?
* 第一种真正的品字：
* 三块高宽是确定的；
* 上面那块用margin: 0 auto;居中；
* 下面两块用float或者inline-block不换行；
* 用margin调整位置使他们居中。
* 第二种全屏的品字布局:
* 上面的div设置成100%，下面的div分别宽50%，然后使用float或者inline使其不换行。
* 第三种用Flex布局

> 一个满屏品字布局怎么设计？ https://blog.csdn.net/sjinsa/article/details/70903940

> CSS 常见布局方式 https://juejin.im/post/599970f4518825243a78b9d5

> CSS布局解决方案（终结版） https://segmentfault.com/a/1190000013565024?utm_source=channel-hottest#articleHeader2

> CSS布局说——可能是最全的 https://segmentfault.com/a/1190000011358507#articleHeader0

> CSS布局十八般武艺都在这里了 http://web.jobbole.com/90844/

> CSS常见布局代码整理 http://blog.leanote.com/post/code.zhangrui@gmail.com/CSS%E5%B8%B8%E8%A7%81%E5%B8%83%E5%B1%80%E6%95%B4%E7%90%86

## 12.css多列等高如何实现？
> CSS：多列等高布局 https://codepen.io/yangbo5207/post/equh

## 13.经常遇到的浏览器的兼容性有哪些？原因，解决方法是什么，常用hack的技巧 ？
> 经常遇到的浏览器兼容性问题 https://blog.csdn.net/oaa608868/article/details/53464517

## 14.li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？
* 行框的排列会受到中间空白字符（回车\空格）等的影响，因为空格也属于字符,这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为0，就没有空格了。
> https://blog.csdn.net/sjinsa/article/details/70919546

## 15.为什么要初始化CSS样式。
* 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。

## 16.absolute的containing block(容器块)计算方式跟正常流有什么不同？
1. 如果position属性是static或relative，包含块是最近的块级祖先(例如 inline-block, block, list-item)，此元素的百分比值计算方式为包含块的content-box的width、height
2. 如果position: absolute, 包含块是最近的position值为非static元素(fixed,absolute,relative,sticky)，如果都找不到,则为 initial containing block, 百分比计算依据包含块的padding-box;
3. 如果position: fixed, 包含块是初始包含块即根元素
4. 如果position: absolute | fixed，包含块也可以是最近包含以下设置: transform,perspective,will-change: transform | perspective, filter(只在firefox起作用)

> Layout and the containing block https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block
> KB008: 包含块( Containing block ) http://w3help.org/zh-cn/kb/008/

## 17.CSS里的visibility属性有个collapse属性值是干嘛用的？在不同浏览器下以后什么区别？
* 对于表格元素：完全隐藏不占用空间，和display:none效果一样
* 对于其他元素： 和visibility: hidden一样，使元素不可见但仍然占用空间。

> MDN visibility https://developer.mozilla.org/en-US/docs/Web/CSS/visibility

> Difference between Visibility.Collapsed and Visibility.Hidden
 https://stackoverflow.com/questions/886742/difference-between-visibility-collapsed-and-visibility-hidden

## 18.position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样？
* 如果元素的display为none,那么元素不被渲染,position,float不起作用,
* 如果元素拥有position:absolute;或者position:fixed;属性那么元素将为绝对定位,float不起作用.
* 如果元素float属性不是none,元素会脱离文档流,根据float属性值来显示.
* 有浮动,绝对定位,inline-block属性的元素,margin不会和垂直方向上的其他元素margin折叠.
> position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样？ http://www.cnblogs.com/jackyWHJ/p/3756087.html

## 19.对BFC规范(块级格式化上下文：block formatting context)的理解？
> BFC原理详解 https://segmentfault.com/a/1190000006740129
> 前端精选文摘：BFC 神奇背后的原理 http://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html
> 理解CSS中BFC https://www.w3cplus.com/css/understanding-block-formatting-contexts-in-css.html
> 我对BFC的理解 http://www.cnblogs.com/dojo-lzz/p/3999013.html

## 21.请解释一下为什么需要清除浮动？清除浮动的方式
* 添加一个无意义标签`<div style="clear:both"></div>`
* 触发包含块的BFC, overflow:hidden , position:absolute | fixed, display: inline-block;...
* 伪元素::after, `clear::after { content: ''; display:block; height:0; visibility:hidden; clear:both }`

> CSS-清除浮动 https://segmentfault.com/a/1190000004865198

> 浮动从何而来 我们为何要清除浮动 清除浮动的原理是什么 http://www.jb51.net/css/67471.html

> 理解为何需要清除浮动及清除浮动的方法 https://blog.csdn.net/qq_31915745/article/details/72524465

## 22.什么是外边距合并？
  * 外边距合并指的是，当两个垂直外边距相遇时，它们将形成一个外边距。
  * 合并后的外边距的高度等于两个发生合并的外边距的高度中的较大者。
  * 组织margin重叠：在重合元素外包裹一层容器，并触发该容器生成一个BFC。
  > w3school介绍网址： http://www.w3school.com.cn/css/css_margin_collapsing.asp

## 23.zoom:1的清除浮动原理?
* 触发hasLayout, 当设置了zoom的值之后，所设置的元素就会就会扩大或者缩小，高度宽度就会重新计算了，这里一旦改变zoom值时其实也会发生重新渲染，运用这个原理，也就解决了ie下子元素浮动时候父元素不随着自动扩大的问题。

> 详说清除浮动 http://kayosite.com/remove-floating-style-in-detail.html
> RM8002: 不能同时在 IE6 IE7 IE8(Q) 中触发 hasLayout 并在其他浏览器中创建 Block Formatting Context 的元素在各浏览器中的表现会有差异 http://www.w3help.org/zh-cn/causes/RM8002

## 25.使用 CSS 预处理器吗？喜欢那个？
 * Stylus
 
 > stylus入门使用方法 https://segmentfault.com/a/1190000002712872

## 26.CSS优化、提高性能的方法有哪些？
> https://www.zhihu.com/question/19886806

## 27.浏览器是怎样解析CSS选择器的？
> CSS选择器的解析是从右向左解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。
而在 CSS 解析完毕后，需要将解析的结果与 DOM Tree 的内容一起进行分析建立一棵 Render Tree，最终用来进行绘图。在建立 Render Tree 时（WebKit 中的「Attachment」过程），浏览器就要为每个 DOM Tree 中的元素根据 CSS 的解析结果（Style Rules）来确定生成怎样的 Render Tree。
> CSS选择器从右向左的匹配规则 http://www.cnblogs.com/zhaodongyu/p/3341080.html

## 28.在网页中的应该使用奇数还是偶数的字体？为什么呢？
* 使用偶数字体。偶数字号相对更容易和 web 设计的其他部分构成比例关系。
* Windows 自带的点阵宋体（中易宋体）从 Vista 开始只提供 12、14、16 px 这三个大小的点阵，而 13、15、17 px时用的是小一号的点。（即每个字占的空间大了 1 px，但点阵没变），于是略显稀疏。
* 习惯的延续

## 29.margin和padding分别适合什么场景使用？
* margin是用来隔开元素与元素的间距；padding是用来隔开元素与内容的间隔。
* margin用于布局分开元素使元素与元素互不相干；
* padding用于元素与内容之间的间隔，让内容（文字）与（包裹）元素之间有一段
* 何时使用margin：	
	+ 需要在border外侧添加空白
	+ 空白处不需要背景色
	+ 上下相连的两个盒子之间的空白，需要相互抵消时。
* 何时使用padding：
	* 需要在border内侧添加空白
	* 空白处需要背景颜色
	* 上下相连的两个盒子的空白，希望为两者之和。
* 兼容性的问题：在IE5\IE6中，为float的盒子指定margin时，左侧的margin可能会变成两倍的宽度。通过改变padding或者指定盒子的display：inline解决。

## 30.元素竖向的百分比设定是相对于容器的高度吗？
* 当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。

> https://segmentfault.com/a/1190000012955996

## 31.全屏滚动的原理是什么？用到了CSS的那些属性？
* 原理：有点类似于轮播，方法一是整体的元素一直排列下去，假设有5个需要展示的全屏页面，那么高度是500% ，只是展示100%，剩下的可以通过transform进行y轴定位，也可以通过margin-top实现
* overflow：hidden；transition：all 1000ms ease

> H5全屏滑动 https://segmentfault.com/a/1190000003691168
> iSlider https://github.com/be-fe/iSlider

## 32.什么是响应式设计？响应式设计的基本原理是什么？如何兼容低版本的IE？
* 响应式网站设计(Responsive Web design)是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。
	基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。
	页面头部必须有meta声明的viewport。
`<meta name=’viewport’ content=”width=device-width, initial-scale=1. maximum-scale=1,user-scalable=no”>`
> 关于移动布局的系列文章 https://anotherleon.github.io/2017/11/05/%E4%BB%8Eline-height%E5%92%8Cvertical-align%E7%9A%84%E5%85%B3%E7%B3%BB%E5%BC%80%E5%A7%8B%E7%90%86%E8%A7%A3css%E5%B8%83%E5%B1%80/v

> 响应式设计总结 https://www.zybuluo.com/JRuiCoder/note/303046

> [CSS] 详细解释 @media 属性与 (max-width:) and (min-width) 之间的关系及用法 https://www.tuicool.com/articles/FFn632q

## 33.视差滚动效果，如何给每页做不同的动画？（回到顶部，向下滑动要再次出现，和只出现一次分别怎么做？）
> 小tip: 纯CSS实现视差滚动效果 http://www.zhangxinxu.com/wordpress/2015/03/css-only-parallax-effect/
> 视差滚动(Parallax Scrolling)效果的原理和实现 http://www.cnblogs.com/JoannaQ/archive/2013/02/08/2909111.html
> Alloy Team的《视差滚动的爱情故事》 http://www.alloyteam.com/2014/01/parallax-scrolling-love-story/

## 34.::before 和 :after中双冒号和单冒号 有什么区别？解释一下这2个伪元素的作用。
* 单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素。
* ::before就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并不存在于dom之中，只存在在页面之中。
* :before 和 :after 这两个伪元素，是在CSS2.1里新出现的。起初，伪元素的前缀使用的是单冒号语法，但随着Web的进化，在CSS3的规范里，伪元素的语法被修改成使用双冒号，成为::before ::after
  * 双冒号是在CSS3规范中引入的，用于区分伪类和伪元素。不过浏览器需要同时支持旧的已经存在的伪元素写法，比如:first-line、:first-letter、:before、:after等，而新的在CSS3中引入的伪元素则不允许再支持旧的单冒号的写法。

## 35.如何修改chrome记住密码后自动填充表单的黄色背景？
	`input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    background-color: rgb(250, 255, 189); /* #FAFFBD; */
    background-image: none;
    color: rgb(0, 0, 0);
  }`

## 36.你对line-height是如何理解的？
* 具体来说是指两行文字间基线之间的距离
* 深入理解CSS中的行高 http://www.cnblogs.com/rainman/archive/2011/08/05/2128068.html
* 我对line-height及vertical-align的一点理解 https://segmentfault.com/a/1190000013031367
> https://anotherleon.github.io/2017/11/05/%E5%85%B3%E4%BA%8Eline-height&vertical-align/#more
> css行高line-height的一些深入理解及应用 http://www.zhangxinxu.com/wordpress/2009/11/css%E8%A1%8C%E9%AB%98line-height%E7%9A%84%E4%B8%80%E4%BA%9B%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E5%8F%8A%E5%BA%94%E7%94%A8/

## 37.设置元素浮动后，该元素的display值是多少？
	`display: block`

## 38.怎么让Chrome支持小于12px 的文字？
	`p{font-size:10px;-webkit-transform:scale(0.8);} //0.8是缩放比例`

## 39.让页面里的字体变清晰，变细用CSS怎么做？
* -webkit-font-smoothing只在Mac OS X/macOS上起作用-webkit-font-smoothing：antialiased是最佳的，灰度平滑。

## 40.font-style属性可以让它赋值为“oblique” oblique是什么意思？
* oblique: 倾斜的文字； italic: 斜体字 ；上
* oblique基本上是一种模仿的斜体，而不是真正的斜体。

## 41.position:fixed;在android下无效怎么处理？
* fixed的元素是相对整个页面固定位置的，你在屏幕上滑动只是在移动这个所谓的viewport，
* 并不是不支持fixed，只是fixed的元素不是相对手机屏幕固定的。
`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>`

## 42.如果需要手动写动画，你认为最小时间间隔是多久，为什么？（阿里）
* 多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60＊1000ms ＝ 16.7ms

## 43.display:inline-block 什么时候会显示间隙？(携程)
* 有空格时候会有间隙 解决：移除空格
* margin正值的时候 解决：margin使用负值
* 使用font-size时候 解决：font-size:0、letter-spacing、word-spacing

## 44.overflow: scroll时不能平滑滚动的问题怎么处理？
	`-webkit-overflow-scrolling: touch;`

## 45.有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度。
* `.outer { posstion:relative; height: 600px } .header{ hieght:100px; } .content{ position: absolute; top:100px;left:0; bottom:0 }`
* `.outer{ height:600px;padding-top: 100px } .header{ height:100px;margin-top:-100px } .content { height:100% }`
* `.outer{ position:relative;height:600px;padding-top: 100px } .header{ position: absolute;top:0;left:0;width:100%;height:100px; } .content { height:100% }`
* `.outer { display:flex; flex-direction:column; height:600px;} .header {height:100px} .content{ flex: 1}`

## 46.png、jpg、gif 这些图片格式解释一下，分别什么时候用。有没有了解过webp？
* png是便携式网络图片（Portable Network Graphics）是一种无损数据压缩位图文件格式.优点是：压缩比高，色彩好。 大多数地方都可以用。
* jpg是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在www上，被用来储存和传输照片的格式。
* gif是一种位图文件格式，以8位色重现真色彩的图像。可以实现动画效果.
* webp格式是谷歌在2010年推出的图片格式，压缩率只有jpg的2/3，大小比png小了45%。缺点是压缩的时间更久了，兼容性不好，目前谷歌和opera支持。

> 参考资料： [Image Optimization Part 2: Selecting the Right File Format](http://www.yuiblog.com/blog/2008/11/04/imageopt-2/) 

> 图像压缩技术：选择正确的图片格式 https://www.jianshu.com/p/261cd13757ce

## 47.什么是Cookie隔离？（或者说：请求资源的时候不要让它带cookie怎么做）
* cookie隔离技术则是通过使用多个非主要域名来请求静态文件，如果静态文件都放在主域名下，那静态文件请求的时候带有的cookie的数据提交给server是非常浪费的，还不如隔离开。
* 因为cookie有域的限制，因此不能跨域提交请求，故使用非主要域名的时候，请求头中就不会带有cookie数据，
	这样可以降低请求头的大小，降低请求时间，从而达到降低整体请求延时的目的。
* 同时这种方式不会将cookie传入Web Server，也减少了Web Server对cookie的处理分析环节，
	提高了webserver的http请求的解析速度。

## 48.style标签写在body后与body前有什么区别？
* 页面加载自上而下 当然是先加载样式。
* 写在body标签后由于浏览器以逐行方式对HTML文档进行解析，当解析到写在尾部的样式表（外联或写在style标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在windows的IE下可能会出现FOUC现象（即样式失效导致的页面闪烁问题）

## 49.什么是CSS 预处理器 / 后处理器？
  * - 预处理器例如：LESS、Sass、Stylus，用来预编译Sass或less，增强了css代码的复用性，
    还有层级、mixin、变量、循环、函数等，具有很方便的UI组件模块化开发能力，极大的提高工作效率。
  * - 后处理器例如：PostCSS，通常被视为在完成的样式表中根据CSS规范处理CSS，让其更有效；目前最常做的
    是给CSS属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

## 50.rem布局的优缺点
> 总结个人使用过的移动端布局方法 https://segmentfault.com/a/1190000010211016#articleHeader10

## 51.实现不使用 border 画出1px高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。
	`<div style="height:1px;overflow:hidden;background:red"></div>`

## 52.如何在页面上实现一个圆形的可点击区域？
`<div id="red" class="click-area" ></div>
	#red{  
	 cursor:pointer;
	 background:red;  
	 width:100px;  
	 height:100px;  
	 border-radius:50%;  
	} `

## 14. 请说出三种减少页面加载时间的方法。
> https://blog.csdn.net/xujie_0311/article/details/42421547

## 15.什么是 FOUC（无样式内容闪烁）？你如何来避免 FOUC？
原因大致为： 1，使用import方法导入样式表。 2，将样式表放在页面底部 3，有几个样式表，放在html结构的不同位置。

其实原理很清楚：当样式表晚于结构性html加载，当加载到此样式表时，页面将停止之前的渲染。此样式表被下载和解析后，将重新渲染页面，也就出现了短暂的花屏现象。

解决方法： 使用LINK标签将样式表放在文档HEAD中。
## 17.行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
行内元素：a、b、span、img、input、strong、select、label、em、button、textarea
块级元素：div、ul、li、dl、dt、dd、p、h1-h6、blockquote
空元素：即系没有内容的HTML元素，例如：br、meta、hr、link、input、img
## 18.页面导入样式时，使用link和@import有什么区别？
1 老祖宗的差别。link属于XHTML标签，而@import完全是CSS提供的一种方式。

link标签除了可以加载CSS外，还可以做很多其它的事情，比如定义RSS，定义rel连接属性等，@import就只能加载CSS了。

2 加载顺序的差别。当一个页面被加载的时候（就是被浏览者浏览的时候），link引用的CSS会同时被加载，而@import引用的CSS会等到页面全部被下载完再被加载。所以有时候浏览@import加载CSS的页面时开始会没有样式（就是闪烁），网速慢的时候还挺明显.

3 兼容性的差别。由于@import是CSS2.1提出的所以老的浏览器不支持，@import只有在IE5以上的才能识别，而link标签无此问题。

4 使用dom控制样式时的差别。当使用javascript控制dom去改变样式的时候，只能使用link标签，因为@import不是dom可以控制的。
## 27.title与h1的区别、b与strong的区别、i与em的区别？
1、title是网站header部分的内容是网站的标题，而h表示body内的标题、

2、但从视觉上效果观看b与strong、i与em是没有区别的，唯一区别是搜索引擎检索的时候搜索引擎可以识别strong、em标签、而不能识别b与i标签
> https://blog.csdn.net/WKY_CSDN/article/details/75315240

## 12个HTML和CSS必须知道的重点难点问题 
> https://segmentfault.com/a/1190000013375700#articleHeader1
## 12个你未必知道的CSS小知识 
> https://segmentfault.com/a/1190000002528855#articleHeader4
## 移动端CSS书写注意事项 
> 移动端CSS书写注意事项  https://github.com/cssdream/css-creating/issues/8 
> 第六天 移动端Web开发注意事项 https://segmentfault.com/a/1190000007574023 
> 无线Web开发经验谈 http://am-team.github.io/amg/dev-exp-doc.html

## Sticky Footer
> Sticky Footer, Five Ways https://css-tricks.com/couple-takes-sticky-footer/

## CSS3 Transform的perspective属性
> http://www.alloyteam.com/2012/10/the-css3-transform-perspective-property/
> css3实践之摩天轮式图片轮播+3D正方体+3D标签云（perspective、transform-style、perspective-origin）http://www.cnblogs.com/zichi/p/4318780.html

## JavaScript学习笔记：视口宽高、位置与滚动高度
> https://www.w3cplus.com/javascript/offset-scroll-client.html

## 移动适配方案及相关概念
> 移动端适配方案(上下)  https://github.com/riskers/blog/issues/17

## 无线Web开发经验谈
> http://am-team.github.io/amg/dev-exp-doc.html

# JS
## 1.介绍js的基本数据类型。
* Boolean,Null,Undefined,Number,String,Symbol (ECMAScript 6 新定义)
## 2.介绍js有哪些内置对象？
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

## 5.JavaScript有几种类型的值？，你能画一下他们的内存图吗？
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

## 9.Javascript如何实现继承？10.JavaScript继承的几种实现方式？
 * JS继承的实现方式 http://www.cnblogs.com/humin/p/4556820.html

## 11.javascript创建对象的几种方式？
*	1、对象字面量的方式
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

## 12.Javascript作用链域?
* 函数创建时会建立一个预先包含全局变量对象的作用域链（保存在[[scope]]属性中），当函数被调用时，会创建一个当前活动变量和包含环境变量对象的集合，这就是执行环境的作用域链，它的开始是当前的活动对象，然后是包含环境中的变量对象，直到全局环境。（标识符所在的位置越深，访问速度越慢，因此尽量少使用全局变量。） 
## 14.eval是做什么的？
* 把字符串解析成JS代码并运行；

## 15.什么是window对象? 什么是document对象?
 * window对象--代表浏览器中的一个打开的窗口或者框架，window对象会在<body>或者<frameset> 每次出现时被自动创建，在客户端JavaScript中，Window对象是全局对象
 * document对象--代表整个HTML文档，可以用来访问页面中的所有元素。每一个载入浏览器的HTML文档都会成为document对象。document对象使我们可以从脚本中对HTML页面中的所有元素进行访问。

## 17.写一个通用的事件侦听器函数。
* http://www.cnblogs.com/isaboy/p/eventJavascript.html
* http://www.haorooms.com/post/js_EventUtil

## 18.["1", "2", "3"].map(parseInt) 答案是多少？
 * [1, NaN, NaN]

## 19.事件是？IE与火狐的事件机制有什么区别？ 如何阻止冒泡？
* IE是事件冒泡、Firefox同时支持两种事件模型，也就是：捕获型事件和冒泡型事件；
 * ev.stopPropagation();（旧ie的方法 ev.cancelBubble = true;）

~~## 20.什么是闭包（closure），为什么要用它？~~
~~## 21.javascript 代码中的"use strict";是什么意思 ? 使用它区别是什么？~~

## 22.如何判断一个对象是否属于某个类？
* instanceof 或者 constructor

## 23.new操作符具体干了什么呢?
`var obj  = {};
 obj.__proto__ = Base.prototype;
 Base.call(obj)`

## 23.用原生JavaScript的实现过什么功能吗？

## 24.Javascript中，有一个函数，执行时对象查找时，永远不会去查找原型，这个函数是？
 * Object.prototype.hasOwnProperty()

## 25.JSON 的了解？
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

## 29.Ajax 解决浏览器缓存问题？
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

## 38.谈一谈你对ECMAScript6的了解？
## 39.ECMAScript6 怎么写class么，为什么会出现class这种东西?
## 40..call() 和 .apply() 的区别？

## 41.数组和对象有哪些原生方法，列举一下？
> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object

## 42.JS怎么实现一个类，怎么实例化这个类？
> http://www.ruanyifeng.com/blog/2012/07/three_ways_to_define_a_javascript_class.html

~~## 43.JavaScript中的作用域与变量声明提升？~~

## 44.如何编写高性能的Javascript？
> http://www.alloyteam.com/2012/11/performance-writing-efficient-javascript/

## 45.那些操作会造成内存泄漏？
> https://github.com/wengjq/Blog/issues/1

## 46.如何判断当前脚本运行在浏览器还是node环境中？
* typeof global == 'object' && global.global === global

## 48.把 Script 标签 放在页面的最底部的body封闭之前 和封闭之后有什么区别？浏览器会如何解析它们？

## 49.移动端的点击事件的有延迟，时间是多久，为什么会有？ 怎么解决这个延时？
> 300 毫秒点击延迟的来龙去脉 https://thx.github.io/mobile/300ms-click-delay

## 51.Underscore 对哪些 JS 原生对象进行了扩展以及提供了哪些好用的函数方法？
## 53.解释一下 Backbone 的 MVC 实现方式？
## 54.什么是“前端路由”?什么时候适合使用“前端路由”? “前端路由”有哪些优点和缺点?
> https://blog.csdn.net/crystal6918/article/details/77432004

## 56.前端templating(Mustache, underscore, handlebars)是干嘛的, 怎么用?
> http://blog.gejiawen.com/2015/04/08/talk-about-fontend-templates/

## 58.检测浏览器版本版本有哪些方式？
> https://segmentfault.com/a/1190000007640795

## 59.我们给一个dom同时绑定两个点击事件，一个用捕获，一个用冒泡。会执行几次事件，会先执行冒泡还是捕获？
* 绑定在被点击元素的事件是按照代码顺序发生，其他元素通过冒泡或者捕获“感知”的事件，按照W3C的标准，先发生捕获事件，后发生冒泡事件。所有事件的顺序是：其他元素捕获阶段事件 -> 本元素代码顺序事件 -> 其他元素冒泡阶段事件 。

> https://blog.csdn.net/qiqingjin/article/details/51387217

## 60.使用JS实现获取文件扩展名？
>`function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  }`
> [译]如何更有效的获取文件扩展名 https://segmentfault.com/a/1190000004993946

## 61.Webpack热更新实现原理?
> https://zhuanlan.zhihu.com/p/30623057

## 62.请介绍一下JS之事件节流？什么是JS的函数防抖？
## 63.Object.is() 与原来的比较操作符“ ===”、“ ==”的区别？
> https://www.jianshu.com/p/a76dc7e0c5a1

## 64.ES6是如何实现编译成ES5的？
> Babel是如何读懂JS代码的 https://zhuanlan.zhihu.com/p/27289600
> 深入理解Babel原理及其使用，babel把ES6转成ES5的原理是什么？ http://www.fly63.com/article/detial/197

## 65.DOM操作——怎样添加、移除、移动、复制、创建和查找节点。
> 深入浅出DOM基础——《DOM探索之基础详解篇》学习笔记 https://github.com/jawil/blog/issues/9

## 细说 webpack 之流程篇
> http://taobaofed.org/blog/2016/09/09/webpack-flow/

# 其他
## 1.原来公司工作流程是怎么样的，如何与其他人协作的？如何跨部门合作的？
## 2.你遇到过比较难的技术问题是？你是如何解决的？
## 3.设计模式：知道什么是singleton, factory, strategy, decrator么?
## 4.常使用的库有哪些？常用的前端开发工具？开发过什么应用或组件？
## 5.页面重构怎么操作？
## 6.列举IE与其他浏览器不一样的特性？
## 7.什么叫优雅降级和渐进增强？
## 8.是否了解公钥加密和私钥加密。
## 9.WEB应用从服务器主动推送Data到客户端有那些方式？
## 10.对Node的优点和缺点提出了自己的看法？
## 11.你有用过哪些前端性能优化的方法？
## 12.http状态码有那些？分别代表是什么意思？
## 13.一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么？（流程说的越详细越好）
## 14.部分地区用户反应网站很卡，请问有哪些可能性的原因，以及解决方法？
## 15.从打开app到刷新出内容，整个过程中都发生了什么，如果感觉慢，怎么定位问题，怎么解决?
## 16.第一次访问页面中时弹出引导，用户关闭引导，之后再次进入页面时不希望出现引导，如何实现？
## 17.除了前端以外还了解什么其它技术么？你最最厉害的技能是什么？
## 18.你用的得心应手用的熟练地编辑器&开发环境是什么样子？
## 19.对前端工程师这个职位是怎么样理解的？它的前景会怎么样？
## 20.你怎么看待Web App 、hybrid App、Native App？
## 21.你移动端前端开发的理解？（和 Web 前端开发的主要区别是什么？）
## 22.产品进行版本升级时，可能发生不兼容性问题，如何提前预防和解决？
## 23.你对加班的看法？
## 24.平时如何管理你的项目？
## 25.当团队人手不足，把功能代码写完已经需要加班的情况下，你会做前端代码的测试吗？
## 26.说说最近最流行的一些东西吧？常去哪些网站？
## 27.知道什么是SEO并且怎么优化么? 知道各种meta data的含义么?
## 28.移动端（Android IOS）怎么做好用户体验?
## 29.简单描述一下你做过的移动APP项目研发流程？
## 30.你在现在的团队处于什么样的角色，起到了什么明显的作用？
## 31.你认为怎样才是全端工程师（Full Stack developer）？
## 32.介绍一个你最得意的作品吧？
## 33.你有自己的技术博客吗，用了哪些技术？
## 34.对前端安全有什么看法？
## 35.是否了解Web注入攻击，说下原理，最常见的两种攻击（XSS 和 CSRF）了解到什么程度？
## 36.项目中遇到国哪些印象深刻的技术难题，具体是什么问题，怎么解决？。
## 37.最近在学什么东西？
## 38.你的优点是什么？缺点是什么？
## 39.如何管理前端团队?
## 40.最近在学什么？能谈谈你未来3，5年给自己的规划吗？


## 45个JavaScript小技巧 
> http://www.cnblogs.com/zichi/p/5094902.html

## 汤姆大叔的6道javascript编程题题解 
> http://www.cnblogs.com/zichi/p/4362292.html