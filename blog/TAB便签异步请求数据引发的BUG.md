# TAB便签异步请求数据引发的BUG

最近做了一个小程序的项目，用mpvue写的，项目很小，主要有登录页，查询页，查询结果页，维保页等，我负责开发登录和结果页。之前觉得项目很简单，应该很容易就能搞定，没想到十个工作日的排期都在跌跌撞撞中进行。

## 问题描述
* 说说遇到的问题吧，结果页有一部分列表是使用tab按钮的方式展现的，按照采购和零售行情，把不同的来源的车放在不同的tab下进行切换展示。当我非常快速的点击切换tab页时，最后切换的那个tab页会先显示别的tab下的数据然后再变成自己的数据。

## 原因分析
* 事后分析原因的话，其实很简单。就是异步请求导致的数据返回的顺序不确定，导致给list赋值的时候，无法保证给list的就是当前便签请求到到的数据。比如我点击tab a之后马上点击了tab b，然后又点tab a，这时候有可能b的数据请求结束，并把数据给了carList，而渲染a下的列表用的数据实际上是请求b返回的。所以a下面会先显示b的，然后再显示a自己的数据。

## 解决方法一（同步）
* 其实一开始并没有这个问题，之前后端把所有的数据一次性给前端，前端负责分类显示，不涉及到异步请求的过程，因此没有这个现象。因此我认为解决方法之一就是和后端预定好请求的方式，如果遇到展示数据很少的情况可以一次请求，如果是使用vue的话，直接设置list为computed属性，根据name或者id，filter数组即可。

## 解决方法二（异步）
* 这种情况比较复杂，我采用的解决办法是设置一个cache对象，代码如下
```javascript
    getCarList(searchForm, options) {
        // ... 省略部分非关键代码
        const sellerName = this.sellerName 
        if (!sellerName) return
        const cache = this.cacheList[sellerName]
        if (cache && !!cache.length) {
            this.carList = cache
            return
        }
        // 异步请求过程
        wx.request({
            // ... 省略部分代码
            success: (res) => {
                // 先把获得的数据放进缓存
                this.cacheList[sellerName] = res.data.data.carInfoList
                // 出现bug的地方,this.carList就好比一个筐子，谁先请求到数据，它的里面装的就是谁。
                // this.carList = res.data.data.carInfoList // 同时把数据给v-for循环中的carList，carList得值变化或会重新渲染列表
                this.carList = this.cacheList[this.sellerName] || [] // 临时处理的办法：从缓存中找，没找到就是空的
            },
        })
    },
```
### 缺陷一
* `this.carList = this.cacheList[this.sellerName]`，这样的写法隐藏隐患，因为carList，cacheList，sellerName随时可能在请求的过程中被修改。比如：由tab a快速切换到 tab b 的时候，tab a 正好请求回数据，这时候实际上执行的是 `this.carList = this.cacheList['b'] || []`，而这时候缓存中其实肯定是没有b的，所以必然为空数组。

### 改进一
```javascript
     async getCarList(sellerName, searchForm, options) {
        // ... 省略部分非关键代码
        if (!sellerName) return
        const cache = this.cacheList[sellerName]
        if (cache && !!cache.length) {
            this.carList = cache
            return
        }
        // promise化异步请求过程
        const result = await new Promise((resolve, reject) => {
            wx.request({/* 省略 */})
        })
        this.cacheList[sellerName] = result.carInfoList
        this.carList = this.cacheList[sellerName]
    },
```
### 缺陷二
* 快速切换tab（还没有缓存）的时候，每次点击都会请求一次数据，造成多次无用请求。

### 改进二
```javascript
    
```

## 更广义的解决方案

