# HTML
## 1.Doctype作用? 严格模式与混杂(兼容)模式如何区分？它们有何意义?
	* !DOCTYPE声明位于位于HTML文档中的第一行，处于html标签之前。告知浏览器的解析器用什么文档标准解析这个文档。DOCTYPE不存在或格式不正确会导致文档以兼容模式呈现。
	* 标准模式的排版 和JS运作模式都是以该浏览器支持的最高标准运行。在兼容模式中，页面以宽松的向后兼容的方式显示,模拟老式浏览器的行为以防止站点无法工作。

## 2.说说你对语义化的理解？(什么是语义化的HTML?)
	* html语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；
	* 即使没有CSS样式也以一种文档格式显示，并且是容易阅读的。
	* 利于搜索引擎的根据标记来确定上下文和各个关键字的权重，利于 SEO。
	* 源代码更易读，便于阅读维护理解。

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

## 5.常见兼容性问题？
> CSS常见兼容性问题总结 http://www.cnblogs.com/imwtr/p/4340010.html
> IE6 浏览器常见兼容问题 大汇总（23个） http://blog.163.com/hongshaoguoguo@126/blog/static/18046981201371611543769/


## 9.html5有哪些新特性、移除了那些元素？如何处理HTML5新标签的浏览器兼容问题？如何区分 HTML 和 HTML5？
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

## 10.iframe的缺点？
* iframe会阻塞主页面的Onload事件；
* 搜索引擎的检索程序无法解读这种页面，不利于SEO;
* iframe和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载。
* 使用iframe之前需要考虑这两个缺点。如果需要使用iframe，最好是通过javascript动态给iframe添加src属性值，这样可以绕开以上两个问题。

## 11.如何实现浏览器内多个标签页之间的通信?
> 多个标签页之间的通信 https://segmentfault.com/q/1010000006664804

## 12.webSocket如何兼容低浏览器？
* Adobe Flash Socket 、 ActiveX HTMLFile (IE) 、 基于 multipart 编码发送 XHR 、 基于长轮询的 XHR

> WebSocket 教程 http://www.ruanyifeng.com/blog/2017/05/websocket.html
> WebSocket兼容到低版本浏览器 https://www.web-tinker.com/article/20324.html


## 16.HTML5 为什么只需要写 <!DOCTYPE HTML>？
 * HTML5 不基于 SGML，因此不需要对DTD进行引用，但是需要doctype来规范浏览器的行为
 * HTML4.01基于SGML,所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型。


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

## 40个重要的HTML5面试题及答案
> http://blog.jobbole.com/78346/#q2

# CSS
## 1.介绍一下标准的CSS的盒子模型？低版本IE的盒子模型有什么不同的？
* 标准盒子模型：宽度=内容的宽度（content）+ border + padding + margin
* 低版本IE盒子模型：宽度=内容宽度（content+border+padding）+ margin

> 盒模型 https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model
> https://github.com/ivanberry/CSS-Knowledge/issues/3

## 2.CSS选择符有哪些？哪些属性可以继承？
* CSS选择符：id选择器(#myid)、类选择器(.myclassname)、标签选择器(div, h1, p)、相邻选择器(h1 + p)、子选择器（ul > li）、后代选择器（li a）、通配符选择器（\*）、属性选择器（a[rel="external"]）、伪类选择器（a:hover, li:nth-child）
* 可继承的属性：font-size, font-family, color
* 不可继承的样式：border, padding, margin, width, height
* 优先级（就近原则）：!important > [ id > class > tag ] 
* !important 比内联优先级高
> http://www.w3school.com.cn/cssref/css_selectors.asp
> http://www.ruanyifeng.com/blog/2009/03/css_selectors.html

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
1. 父元素高度确定的单行文本（内联元素）
* 设置 height = line-height；
2. 父元素高度确定的多行文本（内联元素）
* a:插入table （插入方法和水平居中一样），然后设置 vertical-align:middle；
* b:先设置 display:table-cell 再设置 vertical-align:middle；

### 块级元素居中方案
#### 水平居中设置：
1. 定宽块状元素
* 设置 左右 margin 值为 auto；
2. 不定宽块状元素
* a:在元素外加入 table 标签（完整的，包括 table、tbody、tr、td），该元素写在 td 内，然后设置 margin 的值为 auto；
* b:给该元素设置 displa:inine 方法；
* c:父元素设置 position:relative 和 left:50%，子元素设置 position:relative 和 left:50%；

#### 垂直居中设置：
	* 使用position:absolute（fixed）,设置left、top、margin-left、margin-top的属性;
	* 利用position:fixed（absolute）属性，margin:auto这个必须不要忘记了;
	* 利用display:table-cell属性使内容垂直居中;
	* 使用css3的新属性transform:translate(x,y)属性;
	* 使用:before元素;

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
>Flex 布局教程：语法篇 http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

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
> https://blog.csdn.net/sjinsa/article/details/70903940

## 12.css多列等高如何实现？
> CSS：多列等高布局 https://codepen.io/yangbo5207/post/equh

## 13.经常遇到的浏览器的兼容性有哪些？原因，解决方法是什么，常用hack的技巧 ？
* 不同浏览器的标签默认的margin和padding不一样。hack \*{margin:0;padding:0;}
* IE6双边距bug：块属性标签float后，又有横行的margin情况下，在IE6显示margin比设置的大。hack：display:inline;将其转化为行内属性。
* 渐进识别的方式，从总体中逐渐排除局部。首先，巧妙的使用“9”这一标记，将IE浏览器从所有情况中分离出来。接着，再次使用“+”将IE8和IE7、IE6分离开来，这样IE8已经独立识别。
	`{
	background-color:#f1ee18;/*所有识别*/
	.background-color:#00deff\9; /*IE6、7、8识别*/
	+background-color:#a200ff;/*IE6、7识别*/
	_background-color:#1e0bd1;/*IE6识别*/
	}`
* 设置较小高度标签（一般小于10px），在IE6，IE7中高度超出自己设置高度。hack：给超出高度的标签设置overflow:hidden;或者设置行高line-height 小于你设置的高度。
* IE下，可以使用获取常规属性的方法来获取自定义属性,也可以使用getAttribute()获取自定义属性；Firefox下，只能使用getAttribute()获取自定义属性。解决方法:统一通过getAttribute()获取自定义属性。
* Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示,可通过加入 CSS 属性 -webkit-text-size-adjust: none; 解决。
* 超链接访问过后hover样式就不出现了，被点击访问过的超链接样式不再具有hover和active了。解决方法是改变CSS属性的排列顺序:L-V-H-A ( love hate ): a:link, a:visited, a:hover, a:active,

## 14.li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？
* 行框的排列会受到中间空白字符（回车\空格）等的影响，因为空格也属于字符,这些空白也会被应用样式，占据空间，所以会有间隔，把字符大小设为0，就没有空格了。
> https://blog.csdn.net/sjinsa/article/details/70919546

## 15.为什么要初始化CSS样式。
* 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。

## 16.absolute的containing block(容器块)计算方式跟正常流有什么不同？
* 0.先找到其祖先元素中最近的 position 值不为 static 的元素
* 1.若此元素为 inline 元素,则 containing block 为能够包含这个元素生成的第一个和最后一个 inline box 的 padding box (除 * margin, border 外的区域) 的最小矩形；
* 2.否则,则由这个祖先元素的 padding box 构成。
* 3.如果都找不到,则为 initial containing block。
* 补充：
* 1. static(默认的)/relative：简单说就是它的父元素的内容框(即去掉 padding 的部分)
* 2. absolute: 向上找最近的定位为 absolute/relative 的元素
* 3. fixed: 它的 containing block 一律为根元素(html/body),根元素也是 initialcontaining block

> All about the containing block https://developer.mozilla.org/zh-CN/docs/Web/CSS/All_About_The_Containing_Block

## 17.CSS里的visibility属性有个collapse属性值是干嘛用的？在不同浏览器下以后什么区别？
* 当一个元素的visibility属性被设置成collapse值后，对于一般的元素，它的表现跟hidden是一样的。
	* chrome中，使用collapse值和使用hidden没有区别。
	* firefox，opera和IE，使用collapse值和使用display：none没有什么区别。

## 18.position跟display、margin collapse、overflow、float这些特性相互叠加后会怎么样？
	* 如果元素的display为none,那么元素不被渲染,position,float不起作用,
	* 如果元素拥有position:absolute;或者position:fixed;属性那么元素将为绝对定位,float不起作用.
	* 如果元素float属性不是none,元素会脱离文档流,根据float属性值来显示.
	* 有浮动,绝对定位,inline-block属性的元素,margin不会和垂直方向上的其他元素margin折叠.

## 19.对BFC规范(块级格式化上下文：block formatting context)的理解？
> BFC原理详解 https://segmentfault.com/a/1190000006740129
> 前端精选文摘：BFC 神奇背后的原理 http://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html
> 理解CSS中BFC https://www.w3cplus.com/css/understanding-block-formatting-contexts-in-css.html
## 21.请解释一下为什么需要清除浮动？清除浮动的方式
> CSS-清除浮动 https://segmentfault.com/a/1190000004865198
> 理解为何需要清除浮动及清除浮动的方法 https://blog.csdn.net/qq_31915745/article/details/72524465

## 22.什么是外边距合并？
  * 外边距合并指的是，当两个垂直外边距相遇时，它们将形成一个外边距。
  * 合并后的外边距的高度等于两个发生合并的外边距的高度中的较大者。
  * 组织margin重叠：在重合元素外包裹一层容器，并触发该容器生成一个BFC。
  > w3school介绍网址： http://www.w3school.com.cn/css/css_margin_collapsing.asp

## 23.zoom:1的清除浮动原理?
* 触发hasLayout, 当设置了zoom的值之后，所设置的元素就会就会扩大或者缩小，高度宽度就会重新计算了，这里一旦改变zoom值时其实也会发生重新渲染，运用这个原理，也就解决了ie下子元素浮动时候父元素不随着自动扩大的问题。

> 详说清除浮动 http://kayosite.com/remove-floating-style-in-detail.html

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
	* 原理：有点类似于轮播，整体的元素一直排列下去，假设有5个需要展示的全屏页面，那么高度是500%，只是展示100%，剩下的可以通过transform进行y轴定位，也可以通过margin-top实现
	* overflow：hidden；transition：all 1000ms ease；
> H5全屏滑动 https://segmentfault.com/a/1190000003691168

## 32.什么是响应式设计？响应式设计的基本原理是什么？如何兼容低版本的IE？
	* 响应式网站设计(Responsive Web design)是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。
	基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。
	页面头部必须有meta声明的viewport。
`<meta name=’viewport’ content=”width=device-width, initial-scale=1. maximum-scale=1,user-scalable=no”>`
> 关于移动布局的系列文章 https://anotherleon.github.io/2017/11/05/%E4%BB%8Eline-height%E5%92%8Cvertical-align%E7%9A%84%E5%85%B3%E7%B3%BB%E5%BC%80%E5%A7%8B%E7%90%86%E8%A7%A3css%E5%B8%83%E5%B1%80/v
> 响应式设计总结 https://www.zybuluo.com/JRuiCoder/note/303046

## 33.视差滚动效果，如何给每页做不同的动画？（回到顶部，向下滑动要再次出现，和只出现一次分别怎么做？）
> 小tip: 纯CSS实现视差滚动效果 http://www.zhangxinxu.com/wordpress/2015/03/css-only-parallax-effect/
> 视差滚动(Parallax Scrolling)效果的原理和实现 http://www.cnblogs.com/JoannaQ/archive/2013/02/08/2909111.html

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
	* 正常版本的倾斜 
## 41.position:fixed;在android下无效怎么处理？
	* fixed的元素是相对整个页面固定位置的，你在屏幕上滑动只是在移动这个所谓的viewport，
	* 并不是不支持fixed，只是fixed的元素不是相对手机屏幕固定的。
`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>`

## 42.如果需要手动写动画，你认为最小时间间隔是多久，为什么？（阿里）
	* 多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60＊1000ms ＝ 16.7ms

## 43.display:inline-block 什么时候会显示间隙？(携程)
## 44.overflow: scroll时不能平滑滚动的问题怎么处理？
## 45.有一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度。
## 46.png、jpg、gif 这些图片格式解释一下，分别什么时候用。有没有了解过webp？
## 47.什么是Cookie 隔离？（或者说：请求资源的时候不要让它带cookie怎么做）
## 48.style标签写在body后与body前有什么区别？
## 49.什么是CSS 预处理器 / 后处理器？
## 50.rem布局的优缺点
## 51.实现不使用 border 画出1px高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果。
## 52.如何在页面上实现一个圆形的可点击区域？
## 6.解释下浮动和它的工作原理？清除浮动的技巧
## 7.浮动元素引起的问题和解决办法？
## 8.DOM操作——怎样添加、移除、移动、复制、创建和查找节点。
## 13. 你如何对网站的文件和资源进行优化？
## 14. 请说出三种减少页面加载时间的方法。
## 15.什么是 FOUC（无样式内容闪烁）？你如何来避免 FOUC？
## 17.行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
## 18.页面导入样式时，使用link和@import有什么区别？
## 27.title与h1的区别、b与strong的区别、i与em的区别？

## 12个HTML和CSS必须知道的重点难点问题 https://segmentfault.com/a/1190000013375700#articleHeader1
## 12个你未必知道的CSS小知识 https://segmentfault.com/a/1190000002528855#articleHeader4
# JS
## 1.介绍js的基本数据类型。
## 2.介绍js有哪些内置对象？
## 3.说几条写JavaScript的基本规范？
## 4.JavaScript原型、原型链有什么特点？
## 5.JavaScript有几种类型的值？，你能画一下他们的内存图吗？
## 6.如何将字符串转化为数字，例如'12.3b'?
## 7.如何将浮点数点左边的数每三位添加一个逗号，如12000000.11转化为『12,000,000.11』?
## 8.如何实现数组的随机排序？
## 9.Javascript如何实现继承？
## 10.JavaScript继承的几种实现方式？
## 11.javascript创建对象的几种方式？
## 12.Javascript作用链域?
## 13.谈谈This对象的理解。
## 14.eval是做什么的？
## 15.什么是window对象? 什么是document对象?
## 16.null，undefined 的区别？
## 17.写一个通用的事件侦听器函数。
## 18.["1", "2", "3"].map(parseInt) 答案是多少？
## 19.事件是？IE与火狐的事件机制有什么区别？ 如何阻止冒泡？
## 20.什么是闭包（closure），为什么要用它？
## 21.javascript 代码中的"use strict";是什么意思 ? 使用它区别是什么？
## 22.如何判断一个对象是否属于某个类？
## 23.new操作符具体干了什么呢?
## 23.用原生JavaScript的实现过什么功能吗？
## 24.Javascript中，有一个函数，执行时对象查找时，永远不会去查找原型，这个函数是？
## 25.JSON 的了解？
## 26.[].forEach.call($$("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)}) 能解释一下这段代码的意思吗？
## 27.js延迟加载的方式有哪些（异步加载JS的方式有哪些？）？
## 28.Ajax 是什么? 如何创建一个Ajax？
## 29.Ajax 解决浏览器缓存问题？
## 30.同步和异步的区别?
## 31.如何解决跨域问题?
## 32.页面编码和被请求的资源编码如果不一致如何处理？
## 33.服务器代理转发时，该如何处理cookie？
## 34.模块化开发怎么做？
## 35.AMD（Modules/Asynchronous-Definition）、CMD（Common Module Definition）规范区别？
## 36.requireJS的核心原理是什么？（如何动态加载的？如何避免多次加载的？如何 缓存的？）
## 37.JS模块加载器的轮子怎么造，也就是如何实现一个模块加载器？
## 38.谈一谈你对ECMAScript6的了解？
## 39.ECMAScript6 怎么写class么，为什么会出现class这种东西?
## 40..call() 和 .apply() 的区别？
## 41.数组和对象有哪些原生方法，列举一下？
## 42.JS怎么实现一个类，怎么实例化这个类？
## 43.JavaScript中的作用域与变量声明提升？
## 44.如何编写高性能的Javascript？
## 45.那些操作会造成内存泄漏？
## 46.如何判断当前脚本运行在浏览器还是node环境中？
## 47.移动端最小触控区域是多大？
## 48.把 Script 标签 放在页面的最底部的body封闭之前 和封闭之后有什么区别？浏览器会如何解析它们？
## 49.移动端的点击事件的有延迟，时间是多久，为什么会有？ 怎么解决这个延时？
## 50.知道各种JS框架(Angular, Backbone, Ember, React, Meteor, Knockout...)么? 能讲出他们各自的优点和缺点么?
## 51.Underscore 对哪些 JS 原生对象进行了扩展以及提供了哪些好用的函数方法？
## 52.哪些操作会造成内存泄漏？
## 53.解释一下 Backbone 的 MVC 实现方式？
## 54.什么是“前端路由”?什么时候适合使用“前端路由”? “前端路由”有哪些优点和缺点?
## 55.知道什么是webkit么? 知道怎么用浏览器的各种工具来调试和debug代码么?
## 56.前端templating(Mustache, underscore, handlebars)是干嘛的, 怎么用?
## 57.用js实现千位分隔符?
## 58.检测浏览器版本版本有哪些方式？
## 59.我们给一个dom同时绑定两个点击事件，一个用捕获，一个用冒泡。会执行几次事件，会先执行冒泡还是捕获？
## 60.使用JS实现获取文件扩展名？
## 61.Webpack热更新实现原理?
## 62.请介绍一下JS之事件节流？什么是JS的函数防抖？
## 63.Object.is() 与原来的比较操作符“ ===”、“ ==”的区别？
## 64.ES6是如何实现编译成ES5的？


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
